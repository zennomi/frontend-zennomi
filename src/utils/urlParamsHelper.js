export default function paramsToObject(urlParams) {
    const entries = urlParams.entries();
    const result = {}
    for (const [key, value] of entries) { // each 'entry' is a [key, value] tupple
      result[key] = value;
    }
    return result;
  }