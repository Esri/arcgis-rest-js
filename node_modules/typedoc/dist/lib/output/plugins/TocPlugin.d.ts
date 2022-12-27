import { Reflection } from "../../models/reflections/index";
import { RendererComponent } from "../components";
import { NavigationItem } from "../models/NavigationItem";
/**
 * A plugin that generates a table of contents for the current page.
 *
 * The table of contents will start at the nearest module or dynamic module. This plugin
 * sets the [[PageEvent.toc]] property.
 */
export declare class TocPlugin extends RendererComponent {
    /**
     * Create a new TocPlugin instance.
     */
    initialize(): void;
    /**
     * Triggered before a document will be rendered.
     *
     * @param page  An event object describing the current render operation.
     */
    private onRendererBeginPage;
    /**
     * Create a toc navigation item structure.
     *
     * @param model   The models whose children should be written to the toc.
     * @param trail   Defines the active trail of expanded toc entries.
     * @param parent  The parent [[NavigationItem]] the toc should be appended to.
     * @param restriction  The restricted table of contents.
     */
    static buildToc(model: Reflection, trail: Reflection[], parent: NavigationItem, restriction?: string[]): void;
}
