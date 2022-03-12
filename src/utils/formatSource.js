const addPrefix = (url) => `https://${url}`;

export function fSlug(string) {
    string = string.trim();
    if (/^[0-9]{1,6}$/.test(string)) return `/nhentai/${string}`;
    string = string.replace(/https:\/\//g, "").replace(/http:\/\//g, "").replace(/www\./g, "");
    string = string.split("?")[0];
    if (/^mangadex\.org\/title\/[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89aAbB][a-f0-9]{3}-[a-f0-9]{12}(\/|$)/.test(string)) return `/mangadex/${string.split("/")[2]}`
    if (/^imgur\.com\/a\/\w{6,9}(\/|$)/.test(string)) return `/imgur/${string.split("/")[2]}`
    if (/^nhentai\.net\/g\/[0-9]{1,6}(\/|$)/.test(string)) return `/nhentai/${string.split("/")[2]}`
    if (/^reddit\.com\/r\/\w+\/comments\/\w{6}(\/|$)/.test(string)) return `/reddit/${string.split("/")[4]}`;
    if (/^reddit\.com\/comments\/\w{6}(\/|$)/.test(string)) return `/reddit/${string.split("/")[2]}`;
    return "";
}

export function fSource(source, slug) {
    if (source === "mangadex") return addPrefix(`mangadex.org/title/${slug}`);
    if (source === "imgur") return addPrefix(`imgur.com/a/${slug}`);
    if (source === "nhentai") return addPrefix(`nhentai.net/g/${slug}`)
    if (source === "reddit") return addPrefix(`reddit.com/comments/${slug}`);
    if (source === "mangadex-vi") return addPrefix(`mangadex.org/title/${slug}`);
    return;
}