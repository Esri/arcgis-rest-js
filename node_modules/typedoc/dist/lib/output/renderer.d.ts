/**
 * Holds all logic used render and output the final documentation.
 *
 * The [[Renderer]] class is the central controller within this namespace. When invoked it creates
 * an instance of [[BaseTheme]] which defines the layout of the documentation and fires a
 * series of [[RendererEvent]] events. Instances of [[BasePlugin]] can listen to these events and
 * alter the generated output.
 */
import { Application } from "../application";
import { Theme } from "./theme";
import { ProjectReflection } from "../models/reflections/project";
import { RendererComponent } from "./components";
import { ChildableComponent } from "../utils/component";
import { Theme as ShikiTheme } from "shiki";
/**
 * The renderer processes a [[ProjectReflection]] using a [[BaseTheme]] instance and writes
 * the emitted html documents to a output directory. You can specify which theme should be used
 * using the ```--theme <name>``` command line argument.
 *
 * Subclasses of [[BasePlugin]] that have registered themselves in the [[Renderer.PLUGIN_CLASSES]]
 * will be automatically initialized. Most of the core functionality is provided as separate plugins.
 *
 * [[Renderer]] is a subclass of [[EventDispatcher]] and triggers a series of events while
 * a project is being processed. You can listen to these events to control the flow or manipulate
 * the output.
 *
 *  * [[Renderer.EVENT_BEGIN]]<br>
 *    Triggered before the renderer starts rendering a project. The listener receives
 *    an instance of [[RendererEvent]]. By calling [[RendererEvent.preventDefault]] the entire
 *    render process can be canceled.
 *
 *    * [[Renderer.EVENT_BEGIN_PAGE]]<br>
 *      Triggered before a document will be rendered. The listener receives an instance of
 *      [[PageEvent]]. By calling [[PageEvent.preventDefault]] the generation of the
 *      document can be canceled.
 *
 *    * [[Renderer.EVENT_END_PAGE]]<br>
 *      Triggered after a document has been rendered, just before it is written to disc. The
 *      listener receives an instance of [[PageEvent]]. When calling
 *      [[PageEvent.preventDefault]] the the document will not be saved to disc.
 *
 *  * [[Renderer.EVENT_END]]<br>
 *    Triggered after the renderer has written all documents. The listener receives
 *    an instance of [[RendererEvent]].
 */
export declare class Renderer extends ChildableComponent<Application, RendererComponent> {
    /**
     * The theme that is used to render the documentation.
     */
    theme?: Theme;
    themeName: string;
    disableOutputCheck: boolean;
    gaID: string;
    gaSite: string;
    hideGenerator: boolean;
    toc: string[];
    highlightTheme: ShikiTheme;
    /**
     * Render the given project reflection to the specified output directory.
     *
     * @param project  The project that should be rendered.
     * @param outputDirectory  The path of the directory the documentation should be rendered to.
     */
    render(project: ProjectReflection, outputDirectory: string): Promise<void>;
    /**
     * Render a single page.
     *
     * @param page An event describing the current page.
     * @return TRUE if the page has been saved to disc, otherwise FALSE.
     */
    private renderDocument;
    /**
     * Ensure that a theme has been setup.
     *
     * If a the user has set a theme we try to find and load it. If no theme has
     * been specified we load the default theme.
     *
     * @returns TRUE if a theme has been setup, otherwise FALSE.
     */
    private prepareTheme;
    /**
     * Prepare the output directory. If the directory does not exist, it will be
     * created. If the directory exists, it will be emptied.
     *
     * @param directory  The path to the directory that should be prepared.
     * @returns TRUE if the directory could be prepared, otherwise FALSE.
     */
    private prepareOutputDirectory;
    getDefaultTheme(): string;
    /**
     * Return the path containing the themes shipped with TypeDoc.
     *
     * @returns The path to the theme directory.
     */
    static getThemeDirectory(): string;
    /**
     * Return the path to the default theme.
     *
     * @returns The path to the default theme.
     */
    static getDefaultTheme(): string;
}
import "./plugins";
