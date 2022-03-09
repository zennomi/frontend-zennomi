

export function fSlug(string) {
    if (/^[0-9]{6}$/.test(string)) return `/nhentai/${string}`;
    string = string.replace(/https:\/\//g, "").replace(/http:\/\//g, "").replace(/www\./g, "");
    string = string.split("?")[0];
    if (/^mangadex\.org\/title\/[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89aAbB][a-f0-9]{3}-[a-f0-9]{12}(\/|$)/.test(string)) return `/mangadex/${string.split("/")[2]}`
    if (/^imgur\.com\/a\/\w{6,9}(\/|$)/.test(string)) return `/imgur/${string.split("/")[2]}`
    if (/^nhentai\.net\/g\/[0-9]{6}(\/|$)/.test(string)) return `/nhentai/${string.split("/")[2]}`
    if (/^reddit\.com\/r\/\w+\/comments\/\w{6}(\/|$)/.test(string)) return `/reddit/${string.split("/")[4]}`;
    return "";
}