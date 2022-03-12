import { uniq } from 'lodash';

import corsAxios from '../utils/corsAxios';
import { fSource } from '../utils/formatSource';

import { PATH_WIBU } from '../routes/paths';

const getTitleApi = async (source, slug) => {
    const url = `https://cubari.moe/read/api/${source}/series/${slug}/`;
    if (source !== 'mangadex-vi') {
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
    console.log(returnData);
    return returnData;
}

export { getTitleApi };