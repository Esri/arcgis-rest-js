import * as shiki from "shiki";
export declare function loadHighlighter(theme: shiki.Theme): Promise<void>;
export declare function isSupportedLanguage(lang: string): boolean;
export declare function getSupportedLanguages(): string[];
export declare function highlight(code: string, lang: string, theme: shiki.Theme): string;
