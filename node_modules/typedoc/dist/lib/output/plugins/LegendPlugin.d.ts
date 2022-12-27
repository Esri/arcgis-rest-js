import { RendererComponent } from "../components";
export interface LegendItem {
    /**
     * Legend item name
     */
    name: string;
    /**
     * List of css classes that represent the legend item
     */
    classes: string[];
}
export declare class LegendBuilder {
    private _classesList;
    constructor();
    build(): LegendItem[][];
    registerCssClasses(classArray: string[]): void;
    private isArrayEqualToSet;
}
/**
 * A plugin that generates the legend for the current page.
 *
 * This plugin sets the [[PageEvent.legend]] property.
 */
export declare class LegendPlugin extends RendererComponent {
    private _project?;
    /**
     * Create a new LegendPlugin instance.
     */
    initialize(): void;
    private onRenderBegin;
    /**
     * Triggered before a document will be rendered.
     *
     * @param page  An event object describing the current render operation.
     */
    private onRendererBeginPage;
    private buildLegend;
}
