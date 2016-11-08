export function parseStrings(data) {
  if (!data) {
    return data;
  } else if (data instanceof Buffer) {
    return data.toString()
  } else if (Array.isArray(data)) {
    return data.map(i => parseStrings(i));
  } else if (typeof data === 'object') {
    for (let key in data) {
      data[key] = parseStrings(data[key]);
    }
  }
  return data;
}