import * as ts from "typescript";
import { Converter, DocumentationEntryPoint } from "./converter/index";
import { Renderer } from "./output/renderer";
import { Serializer } from "./serialization";
import { ProjectReflection } from "./models/index";
import { Logger, NeverIfInternal } from "./utils/index";
import { AbstractComponent, ChildableComponent } from "./utils/component";
import { Options } from "./utils";
import { TypeDocOptions } from "./utils/options/declaration";
/**
 * The default TypeDoc main application class.
 *
 * This class holds the two main components of TypeDoc, the [[Converter]] and
 * the [[Renderer]]. When running TypeDoc, first the [[Converter]] is invoked which
 * generates a [[ProjectReflection]] from the passed in source files. The
 * [[ProjectReflection]] is a hierarchical model representation of the TypeScript
 * project. Afterwards the model is passed to the [[Renderer]] which uses an instance
 * of [[BaseTheme]] to generate the final documentation.
 *
 * Both the [[Converter]] and the [[Renderer]] are subclasses of the [[AbstractComponent]]
 * and emit a series of events while processing the project. Subscribe to these Events
 * to control the application flow or alter the output.
 */
export declare class Application extends ChildableComponent<Application, AbstractComponent<Application>> {
    /**
     * The converter used to create the declaration reflections.
     */
    converter: Converter;
    /**
     * The renderer used to generate the documentation output.
     */
    renderer: Renderer;
    /**
     * The serializer used to generate JSON output.
     */
    serializer: Serializer;
    /**
     * The logger that should be used to output messages.
     */
    logger: Logger;
    options: Options;
    /** @internal */
    loggerType: string | Function;
    /** @internal */
    exclude: Array<string>;
    /** @internal */
    entryPoints: string[];
    /** @internal */
    emit: boolean;
    /**
     * The version number of TypeDoc.
     */
    static VERSION: string;
    /**
     * Create a new TypeDoc application instance.
     *
     * @param options An object containing the options that should be used.
     */
    constructor();
    /**
     * Initialize TypeDoc with the given options object.
     *
     * @param options  The desired options to set.
     */
    bootstrap(options?: Partial<TypeDocOptions>): void;
    /**
     * Return the application / root component instance.
     */
    get application(): NeverIfInternal<Application>;
    /**
     * Return the path to the TypeScript compiler.
     */
    getTypeScriptPath(): string;
    getTypeScriptVersion(): string;
    /**
     * Run the converter for the given set of files and return the generated reflections.
     *
     * @returns An instance of ProjectReflection on success, undefined otherwise.
     */
    convert(): ProjectReflection | undefined;
    convertAndWatch(success: (project: ProjectReflection) => Promise<void>): void;
    /**
     * Render HTML for the given project
     */
    generateDocs(project: ProjectReflection, out: string): Promise<void>;
    /**
     * Run the converter for the given set of files and write the reflections to a json file.
     *
     * @param out The path and file name of the target file.
     * @returns Whether the JSON file could be written successfully.
     */
    generateJson(project: ProjectReflection, out: string): Promise<void>;
    /**
     * Expand a list of input files.
     *
     * Searches for directories in the input files list and replaces them with a
     * listing of all TypeScript files within them. One may use the ```--exclude``` option
     * to filter out files with a pattern.
     *
     * @param inputFiles  The list of files that should be expanded.
     * @returns  The list of input files with expanded directories.
     */
    expandInputFiles(inputFiles: readonly string[]): string[];
    private getEntryPrograms;
    /**
     * Converts a list of file-oriented paths in to DocumentationEntryPoints for conversion.
     * This is in contrast with the package-oriented `getEntryPointsForPackages`
     *
     * @param entryPointPaths  The list of filepaths that should be expanded.
     * @returns  The DocumentationEntryPoints corresponding to all the found entry points
     * @internal - if you want to use this, ask, it's likely okay to expose.
     */
    getEntryPointsForPaths(entryPointPaths: string[], programs?: ts.Program[]): DocumentationEntryPoint[];
    /**
     * Print the version number.
     */
    toString(): string;
}
