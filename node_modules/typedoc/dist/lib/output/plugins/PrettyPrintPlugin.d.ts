import { RendererComponent } from "../components";
import { PageEvent } from "../events";
/**
 * A plugin that pretty prints the generated html.
 *
 * This not only aids in making the generated html source code more readable, by removing
 * blank lines and unnecessary whitespaces the size of the documentation is reduced without
 * visual impact.
 *
 * At the point writing this the docs of TypeDoc took 97.8 MB  without and 66.4 MB with this
 * plugin enabled, so it reduced the size to 68% of the original output.
 */
export declare class PrettyPrintPlugin extends RendererComponent {
    /**
     * Map of all tags that will be ignored.
     */
    static IGNORED_TAGS: {
        area: boolean;
        base: boolean;
        br: boolean;
        wbr: boolean;
        col: boolean;
        command: boolean;
        embed: boolean;
        hr: boolean;
        img: boolean;
        input: boolean;
        link: boolean;
        meta: boolean;
        param: boolean;
        source: boolean;
    };
    /**
     * Map of all tags that prevent this plugin form modifying the following code.
     */
    static PRE_TAGS: {
        pre: boolean;
        code: boolean;
        textarea: boolean;
        script: boolean;
        style: boolean;
    };
    /**
     * Create a new PrettyPrintPlugin instance.
     */
    initialize(): void;
    /**
     * Triggered after a document has been rendered, just before it is written to disc.
     *
     * @param event
     */
    onRendererEndPage(event: PageEvent): void;
}
