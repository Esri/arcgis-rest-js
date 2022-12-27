import { RendererComponent } from "../components";
/**
 * A plugin that copies the subdirectory ´assets´ from the current themes
 * source folder to the output directory.
 */
export declare class AssetsPlugin extends RendererComponent {
    /**
     * Should the default assets always be copied to the output directory?
     */
    copyDefaultAssets: boolean;
    /**
     * Create a new AssetsPlugin instance.
     */
    initialize(): void;
    /**
     * Triggered before the renderer starts rendering a project.
     *
     * @param event  An event object describing the current render operation.
     */
    private onRendererBegin;
}
