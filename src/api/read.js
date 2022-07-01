import { uniq } from 'lodash';
import { parse } from 'date-fns';

import corsAxios from '../utils/corsAxios';
import axios from '../utils/axios';
import { fSource } from '../utils/formatSource';
import { proxyImage } from '../utils/resizeImage';
import { PATH_WIBU } from '../routes/paths';

const getTitleApi = async (source, slug) => {
    if (source === 'mangadex-vi') {
        const returnData = { slug, staff: [], source, path: `${PATH_WIBU.read.root}/${source}/${slug}`, sourceLink: fSource('mangadex', slug) }

        const { data: { data: titleData } } = await corsAxios({
            url: `https://api.mangadex.org/manga/${slug}?includes[]=cover_art`
        })

        returnData.title = Object.values(titleData.attributes.title)[0] || "No title";
        returnData.series_name = returnData.title;
        returnData.description = Object.values(titleData.attributes.description)[0] || "No description";
        const coverArt = titleData.relationships.find(r => r.type === "cover_art")?.attributes.fileName;
        returnData.cover = `https://uploads.mangadex.org/covers/${slug}/${coverArt}`;

        const { data: { data: chaptersData } } = await corsAxios({
            url: `https://api.mangadex.org/manga/${slug}/feed?translatedLanguage[]=vi&order[chapter]=asc&limit=500`,
            method: 'get'
        });

        const chapterArray = chaptersData.map(chapter => ({
            id: chapter.id,
            volume: chapter.attributes.volume,
            chapterNumber: chapter.attributes.chapter,
            title: chapter.attributes.title,
            groupId: chapter.relationships.find(r => r.type === "scanlation_group")?.id || "99c579c7-935b-4bc5-a8e8-a46da371462b",
            release_date: chapter.attributes.createdAt,
            last_updated: chapter.attributes.updatedAt
        }));

        const groupIdArray = uniq(chapterArray.map(c => c.groupId));
        const groupIdToNumber = {};
        const groups = {};
        groupIdArray.forEach((groupId, index) => { groupIdToNumber[groupId] = index; groups[index] = groupId });

        const chapters = {};
        chapterArray.forEach(({ id, volume, chapterNumber, title, groupId, release_date, last_updated }) => {
            const groupNumber = groupIdToNumber[groupId];
            if (!chapters[chapterNumber]) chapters[chapterNumber] = {};
            if (!chapters[chapterNumber].volume) chapters[chapterNumber].volume = volume;
            if (!chapters[chapterNumber].title) chapters[chapterNumber].title = title;
            if (!chapters[chapterNumber].last_updated) chapters[chapterNumber].last_updated = Date.parse(last_updated);

            if (!chapters[chapterNumber].groups) chapters[chapterNumber].groups = {};
            chapters[chapterNumber].groups[groupNumber] = `/read/api/mangadex/chapter/${id}`;
        })

        returnData.chapters = chapters;
        returnData.groups = groups;
        returnData.chapterNumbers = Object.keys(chapters);
        returnData.groupNumbers = Object.keys(groups);
        return returnData;
    }

    if (source === 'blogtruyen') {
        const returnData = { slug, staff: [], groups: { 1: "romcom" }, description: "", source, path: `${PATH_WIBU.read.root}/${source}/${slug}`, sourceLink: fSource('blogtruyen', slug), chapters: {} }

        const { data } = await axios({
            url: `/v1/titles/blogtruyen/${slug}`,
            method: 'get'
        });
        returnData.title = data.title;
        returnData.series_name = returnData.title;
        returnData.cover = proxyImage(data.cover, 'host=https://blogtruyen.vn');
        returnData.chapters = {};
        Object.entries(data.chapters).forEach(([chapterNumber, chapter]) => {

            returnData.chapters[chapterNumber] = {
                volume: "0",
                title: chapter.title,
                groups: {
                    1: chapter.id
                },
                last_updated: parse(chapter.updatedAt, 'dd/MM/yyyy', new Date()).valueOf()
            }
        })
        console.log(returnData);
        returnData.chapterNumbers = Object.keys(returnData.chapters);
        returnData.groupNumbers = Object.keys(returnData.groups);

        return returnData;
    }

    const url = `https://cubari.moe/read/api/${source}/series/${slug}/`;
    const { data } = await corsAxios({
        url: url,
        method: 'get',
    });
    Object.assign(data, {
        staff: uniq([data.author, data.artist]).filter(s => Boolean(s)),
        source,
        chapterNumbers: Object.keys(data.chapters),
        groupNumbers: Object.keys(data.groups),
        path: `${PATH_WIBU.read.root}/${source}/${slug}`,
        sourceLink: fSource(source, slug)
    })
    return data;
}

export { getTitleApi };