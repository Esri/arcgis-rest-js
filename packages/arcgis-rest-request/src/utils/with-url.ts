import { IRequestOptions } from "./IRequestOptions";
import { withOptions } from "./with-options";

export function withUrl<T extends (...args: any[]) => any>(
  func: T,
  url: string
): (...funcArgs: Parameters<T>) => ReturnType<T> {
  return withOptions(func, { url });
}
