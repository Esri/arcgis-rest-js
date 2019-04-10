import { IRequestOptions } from "./IRequestOptions";

export function withOptions<T extends (...args: any[]) => any>(
  func: T,
  defaultOptions: IRequestOptions
): (...funcArgs: Parameters<T>) => ReturnType<T> {
  return (...args: Parameters<T>): ReturnType<T> => {
    const options: IRequestOptions =
      typeof args[args.length - 1] === "object"
        ? {
            ...defaultOptions,
            ...args.pop()
          }
        : defaultOptions;

    return func(...[...args, options]);
  };
}
