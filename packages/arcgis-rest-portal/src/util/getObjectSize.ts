/**
 * @private
 * Information about the size of a json object
 */
export interface IObjectSize {
  bytes: number;
  kilobytes: number;
  megabytes: number;
}

/**
 * @private
 * Helper used to verify object size before storing resource
 * @param object
 * @returns
 */
export function getObjectSize(object: Record<string, any>): IObjectSize {
  // javascript stores strings in unicode, so 2 bytes per char
  const bytes = JSON.stringify(object).length * 2;
  const kilobytes = bytes / 1024;
  const megabytes = kilobytes / 1024;
  return {
    bytes,
    kilobytes,
    megabytes
  };
}
