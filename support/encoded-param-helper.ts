export function encodedParam(key: string, value: any) {
  return encodeURIComponent(key) + "=" + encodeURIComponent(value);
}
