import { IRequestOptions } from "./IRequestOptions";

export function withUrl<T1, T2 extends (...args: any[]) => any>(
  url: string,
  func: T2
): (o: Parameters<T2>[0]) => ReturnType<T2> {
  return (options: Parameters<T2>[0]): ReturnType<T2> => {
    return func({
      ...options,
      ...{ url }
    });
  };
}
