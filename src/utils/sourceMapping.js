import { MangadexLogo, NhentaiLogo, ImgurLogo, RedditLogo, MangadexViLogo, BlogtruyenLogo } from '../assets/logos';

const sourceToIcon = {
    mangadex: MangadexLogo,
    'mangadex-vi': MangadexViLogo,
    nhentai: NhentaiLogo,
    imgur: ImgurLogo,
    reddit: RedditLogo,
    blogtruyen: BlogtruyenLogo
}

const sourceToColor = {
    mangadex: '#FF6740',
    'mangadex-vi': '#d80027',
    imgur: '#1bb76e',
    nhentai: '#EC2854',
    reddit: '#FF4500',
    blogtruyen: '#4176ed'
}

export {sourceToIcon, sourceToColor}