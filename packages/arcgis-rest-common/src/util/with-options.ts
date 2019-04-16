import { IRequestOptions } from "@esri/arcgis-rest-request";

export function withOptions<
  K extends IRequestOptions,
  T extends (...args: any[]) => any
>(
  defaultOptions: IRequestOptions,
  func: T
): (...funcArgs: Parameters<T>) => ReturnType<T> {
  return (...args: Parameters<T>): ReturnType<T> => {
    const options: K =
      typeof args[args.length - 1] === "object"
        ? {
            ...defaultOptions,
            ...args.pop()
          }
        : defaultOptions;

    return func(...[...args, options]);
  };
}
