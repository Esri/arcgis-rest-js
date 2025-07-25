// Allows stripping readonly from types, making them writable.
// From https://stackoverflow.com/questions/46634876/how-can-i-change-a-readonly-property-in-typescript#comment101446253_57485043
export type Writable<T> = { -readonly [K in keyof T]: T[K] };
