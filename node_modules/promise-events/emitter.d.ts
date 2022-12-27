declare type TEventType = string | symbol;
declare type TListener = (...args: any[]) => Promise<any>;
declare type TFilter<T = any> = {
    <S extends T>(callbackfn: (value: T, index: number, array: T[]) => value is S, thisArg?: any): S[];
    (callbackfn: (value: T, index: number, array: T[]) => unknown, thisArg?: any): T[];
};
declare class EventEmitter {
    private _resultFilter;
    private _events;
    private _eventsCount;
    private _domain;
    get maxListeners(): number;
    set maxListeners(n: number);
    getResultFilter(): TFilter | undefined;
    setResultFilter(filter: TFilter | undefined): this;
    get resultFilter(): TFilter | undefined;
    set resultFilter(filter: TFilter | undefined);
    emit(type: TEventType, ...args: any[]): Promise<any>;
    addListener(type: TEventType, listener: TListener): Promise<any>;
    prependListener(type: TEventType, listener: TListener): Promise<any>;
    once(type: TEventType, listener?: TListener): Promise<any>;
    prependOnceListener(type: TEventType, listener: TListener): Promise<any>;
    removeListener(type: TEventType, listener: TListener): Promise<any>;
    removeAllListeners(type: string | symbol): Promise<any>;
    on(type: TEventType, listener: TListener): Promise<any>;
    off(type: TEventType, listener: TListener): Promise<any>;

    static EventEmitter: typeof EventEmitter;
    static defaultMaxListeners: number | undefined;
    static usingDomains: boolean | undefined;
    static listenerCount: (events: EventEmitter, type: TEventType) => number;
}
export = EventEmitter;
