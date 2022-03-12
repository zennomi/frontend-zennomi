import { MangadexLogo, NhentaiLogo, ImgurLogo, RedditLogo, MangadexViLogo } from '../assets/logos';

const sourceToIcon = {
    mangadex: MangadexLogo,
    'mangadex-vi': MangadexViLogo,
    nhentai: NhentaiLogo,
    imgur: ImgurLogo,
    reddit: RedditLogo,
}

const sourceToColor = {
    mangadex: '#FF6740',
    'mangadex-vi': '#d80027',
    imgur: '#1bb76e',
    nhentai: '#EC2854',
    reddit: '#FF4500'
}

export {sourceToIcon, sourceToColor}