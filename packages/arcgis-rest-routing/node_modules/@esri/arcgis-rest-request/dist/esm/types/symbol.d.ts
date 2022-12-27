/**
 *
 */
export interface ISymbol {
    type: SymbolType;
    style?: string;
}
/**
 *
 */
export declare type SymbolType = "esriSLS" | "esriSMS" | "esriSFS" | "esriPMS" | "esriPFS" | "esriTS";
