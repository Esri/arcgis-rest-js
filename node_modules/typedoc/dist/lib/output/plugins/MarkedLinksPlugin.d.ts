import { ContextAwareRendererComponent } from "../components";
import { MarkdownEvent, RendererEvent } from "../events";
/**
 * A plugin that builds links in markdown texts.
 */
export declare class MarkedLinksPlugin extends ContextAwareRendererComponent {
    /**
     * Regular expression for detecting bracket links.
     */
    private brackets;
    /**
     * Regular expression for detecting inline tags like {&amp;link ...}.
     */
    private inlineTag;
    listInvalidSymbolLinks: boolean;
    private warnings;
    /**
     * Create a new MarkedLinksPlugin instance.
     */
    initialize(): void;
    /**
     * Find all references to symbols within the given text and transform them into a link.
     *
     * This function is aware of the current context and will try to find the symbol within the
     * current reflection. It will walk up the reflection chain till the symbol is found or the
     * root reflection is reached. As a last resort the function will search the entire project
     * for the given symbol.
     *
     * @param text  The text that should be parsed.
     * @returns The text with symbol references replaced by links.
     */
    private replaceBrackets;
    /**
     * Find symbol {&amp;link ...} strings in text and turn into html links
     *
     * @param text  The string in which to replace the inline tags.
     * @return      The updated string.
     */
    private replaceInlineTags;
    /**
     * Format a link with the given text and target.
     *
     * @param original   The original link string, will be returned if the target cannot be resolved..
     * @param target     The link target.
     * @param caption    The caption of the link.
     * @param monospace  Whether to use monospace formatting or not.
     * @returns A html link tag.
     */
    private buildLink;
    /**
     * Triggered when [[MarkedPlugin]] parses a markdown string.
     *
     * @param event
     */
    onParseMarkdown(event: MarkdownEvent): void;
    /**
     * Triggered when [[Renderer]] is finished
     */
    onEndRenderer(_event: RendererEvent): void;
    /**
     * Split the given link into text and target at first pipe or space.
     *
     * @param text  The source string that should be checked for a split character.
     * @returns An object containing the link text and target.
     */
    static splitLinkText(text: string): {
        caption: string;
        target: string;
    };
}
