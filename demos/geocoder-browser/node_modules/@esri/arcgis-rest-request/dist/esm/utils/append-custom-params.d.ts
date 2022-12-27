import { IRequestOptions } from "./IRequestOptions.js";
/**
 * Helper for methods with lots of first order request options to pass through as request parameters.
 */
export declare function appendCustomParams<T extends IRequestOptions>(customOptions: T, keys: Array<keyof T>, baseOptions?: Partial<T>): IRequestOptions;
