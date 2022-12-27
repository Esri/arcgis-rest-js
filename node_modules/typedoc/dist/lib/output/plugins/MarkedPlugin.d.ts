import { ContextAwareRendererComponent } from "../components";
import { RendererEvent, MarkdownEvent } from "../events";
import { Theme } from "shiki";
/**
 * A plugin that exposes the markdown, compact and relativeURL helper to handlebars.
 *
 * Templates should parse all comments with the markdown handler so authors can
 * easily format their documentation. TypeDoc uses the Marked (https://github.com/markedjs/marked)
 * markdown parser and HighlightJS (https://github.com/isagalaev/highlight.js) to highlight
 * code blocks within markdown sections. Additionally this plugin allows to link to other symbols
 * using double angle brackets.
 *
 * You can use the markdown helper anywhere in the templates to convert content to html:
 *
 * ```handlebars
 * {{#markdown}}{{{comment.text}}}{{/markdown}}
 * ```
 *
 * The compact helper removes all newlines of its content:
 *
 * ```handlebars
 * {{#compact}}
 *   Compact
 *   this
 * {{/compact}}
 * ```
 *
 * The relativeURL helper simply transforms an absolute url into a relative url:
 *
 * ```handlebars
 * {{#relativeURL url}}
 * ```
 */
export declare class MarkedPlugin extends ContextAwareRendererComponent {
    includeSource: string;
    mediaSource: string;
    theme: Theme;
    /**
     * The path referenced files are located in.
     */
    private includes?;
    /**
     * Path to the output media directory.
     */
    private mediaDirectory?;
    /**
     * The pattern used to find references in markdown.
     */
    private includePattern;
    /**
     * The pattern used to find media links.
     */
    private mediaPattern;
    private sources?;
    private outputFileName?;
    /**
     * Create a new MarkedPlugin instance.
     */
    initialize(): void;
    /**
     * Highlight the syntax of the given text using HighlightJS.
     *
     * @param text  The text that should be highlighted.
     * @param lang  The language that should be used to highlight the string.
     * @return A html string with syntax highlighting.
     */
    getHighlighted(text: string, lang?: string): string;
    /**
     * Parse the given markdown string and return the resulting html.
     *
     * @param text  The markdown string that should be parsed.
     * @param context  The current handlebars context.
     * @returns The resulting html string.
     */
    parseMarkdown(text: string, context: any): string;
    /**
     * Triggered before the renderer starts rendering a project.
     *
     * @param event  An event object describing the current render operation.
     */
    protected onBeginRenderer(event: RendererEvent): void;
    /**
     * Creates an object with options that are passed to the markdown parser.
     *
     * @returns The options object for the markdown parser.
     */
    private createMarkedOptions;
    /**
     * Triggered when [[MarkedPlugin]] parses a markdown string.
     *
     * @param event
     */
    onParseMarkdown(event: MarkdownEvent): void;
}
