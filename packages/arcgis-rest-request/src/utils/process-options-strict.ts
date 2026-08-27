/* Copyright (c) 2026 Environmental Systems Research Institute, Inc. */

import { ILegacyRequestOptions, IRequestOptions } from "./IRequestOptions.js";
import { processOptions } from "./process-options.js";

// Strict mode keeps defaultOptions scoped to v5 request options only.
type PureRequestOptions = Omit<IRequestOptions, keyof ILegacyRequestOptions>;

// Only non-IRequestOptions keys are eligible for extraction.
type ExtractableKey<T extends IRequestOptions> = Exclude<
  keyof T,
  keyof IRequestOptions
>;

type OptionalKeys<T> = {
  [K in keyof T]-?: {} extends Pick<T, K> ? K : never;
}[keyof T];

type RequiredKeys<T> = Exclude<keyof T, OptionalKeys<T>>;

type StrictExtractedResultShape<
  T extends IRequestOptions,
  ToExtractKeys extends readonly ExtractableKey<T>[]
> = Partial<Pick<T, ToExtractKeys[number]>> &
  Pick<T, Extract<ToExtractKeys[number], RequiredKeys<T>>>;

type ProcessOptionsLooseResult<
  T extends IRequestOptions,
  ToExtractKeys extends readonly ExtractableKey<T>[]
> = {
  requestOptions: IRequestOptions;
} & Partial<Pick<T, ToExtractKeys[number]>>;

type ProcessOptionsStrictResult<
  T extends IRequestOptions,
  ToExtractKeys extends readonly ExtractableKey<T>[]
> = {
  requestOptions: IRequestOptions;
} & StrictExtractedResultShape<T, ToExtractKeys>;

interface ProcessOptionsStrictConfig<
  T extends IRequestOptions,
  ToExtractKeys extends readonly ExtractableKey<T>[]
> {
  paramKeys: Array<ExtractableKey<T>>;
  extractKeys: ToExtractKeys;
  defaultOptions?: Partial<PureRequestOptions>;
}

export function processOptionsStrict<
  T extends IRequestOptions,
  const ToExtractKeys extends readonly ExtractableKey<T>[]
>(
  options: T,
  optionsConfig: ProcessOptionsStrictConfig<T, ToExtractKeys>
): ProcessOptionsStrictResult<T, ToExtractKeys> {
  const result = processOptions(options, optionsConfig);

  function assertHasExtractedKeys(
    value: ProcessOptionsLooseResult<T, ToExtractKeys>
  ): asserts value is ProcessOptionsStrictResult<T, ToExtractKeys> {
    optionsConfig.extractKeys.forEach((key) => {
      if (!Object.prototype.hasOwnProperty.call(value, key)) {
        throw new Error(
          `processOptionsStrict() expected extracted key "${String(
            key
          )}" to exist on options.`
        );
      }
    });
  }

  // Enforce the strict contract at runtime before returning.
  assertHasExtractedKeys(result);

  return result;
}
