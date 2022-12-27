// Types.
export type BlorkChecker = (value: any) => boolean;

// Errors.
export declare class ValueError extends TypeError {
	name: string;
	message: string;
	value: any;
	constructor(message: string, value?: any);
}
export declare class BlorkError extends ValueError {}

// Functions.
export declare function check(value: any, type: string, error?: typeof ValueError | { new (message: string): any }): void;
export declare function checker(type: string): BlorkChecker;
export declare function add(name: string, checker: string | BlorkChecker, description?: string): void;
export declare function debug(value: any): string;
