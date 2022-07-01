export default function resizeImage(url, width) {
    return `https://images.weserv.nl/?url=https://services.f-ck.me/v1/image/${btoa(url).replace(/\+/g, "-").replace(/\//g, "_")}&w=${width}`
}

export function proxyImage(url, host) {
    return `https://services.f-ck.me/v1/image/${btoa(url).replace(/\+/g, "-").replace(/\//g, "_")}?host=${host}`
}