/// <reference types="node" />
declare type SupportedSRIAlgorithm = 'sha512' | 'sha384' | 'sha256';
export declare const generateSRI: (buffer?: Buffer, hashAlgorithm?: SupportedSRIAlgorithm) => string;
export {};
