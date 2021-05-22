export const queryStringBuilder = (obj: { [s: string]: unknown; } | ArrayLike<unknown>): string => {
  let params: string[] = [];
  Object.entries(obj).map(([key, value]) => {
    if (Array.isArray(value)) {
      params = params.concat(arrayToQueryString(key, value))
    } else if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      params.push(`${key}=${encodeURIComponent(value.toString())}`);
    }
  });

  return params.join('&');
}

export function arrayToQueryString(paramName: string, items: string[]): string[] {
  return items.map((item, idx) => `${paramName}[${idx}]=${encodeURIComponent(item)}`);
}
