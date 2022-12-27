import { SourceFile, SourceDirectory } from "../sources/index";
import { Reflection, ReflectionKind } from "./abstract";
import { ContainerReflection } from "./container";
import type * as ts from "typescript";
/**
 * A reflection that represents the root of the project.
 *
 * The project reflection acts as a global index, one may receive all reflections
 * and source files of the processed project through this reflection.
 */
export declare class ProjectReflection extends ContainerReflection {
    private symbolToReflectionIdMap;
    private reflectionIdToSymbolMap;
    private referenceGraph?;
    /**
     * A list of all reflections within the project.
     * @deprecated use {@link getReflectionById}, this will eventually be removed.
     *   To iterate over all reflections, prefer {@link getReflectionsByKind}.
     */
    reflections: {
        [id: number]: Reflection;
    };
    /**
     * The root directory of the project.
     */
    directory: SourceDirectory;
    /**
     * A list of all source files within the project.
     */
    files: SourceFile[];
    /**
     * The name of the project.
     *
     * The name can be passed as a command line argument or it is read from the package info.
     * this.name is assigned in the Reflection class.
     */
    name: string;
    /**
     * The contents of the readme.md file of the project when found.
     */
    readme?: string;
    /**
     * The parsed data of the package.json file of the project when found.
     */
    packageInfo: any;
    /**
     * Create a new ProjectReflection instance.
     *
     * @param name  The name of the project.
     */
    constructor(name: string);
    /**
     * Return whether this reflection is the root / project reflection.
     */
    isProject(): this is ProjectReflection;
    /**
     * Return a list of all reflections in this project of a certain kind.
     *
     * @param kind  The desired kind of reflection.
     * @returns     An array containing all reflections with the desired kind.
     */
    getReflectionsByKind(kind: ReflectionKind): Reflection[];
    /**
     * Try to find a reflection by its name.
     *
     * @param names The name hierarchy to look for, if a string, the name will be split on "."
     * @return The found reflection or undefined.
     */
    findReflectionByName(arg: string | string[]): Reflection | undefined;
    /**
     * When excludeNotExported is set, if a symbol is exported only under a different name
     * there will be a reference which points to the symbol, but the symbol will not be converted
     * and the rename will point to nothing. Warn the user if this happens.
     */
    removeDanglingReferences(): void;
    /**
     * Registers the given reflection so that it can be quickly looked up by helper methods.
     * Should be called for *every* reflection added to the project.
     */
    registerReflection(reflection: Reflection, symbol?: ts.Symbol): void;
    /**
     * Removes a reflection from the documentation. Can be used by plugins to filter reflections
     * out of the generated documentation. Has no effect if the reflection is not present in the
     * project.
     */
    removeReflection(reflection: Reflection): void;
    /**
     * Gets the reflection registered for the given reflection ID, or undefined if it is not present
     * in the project.
     */
    getReflectionById(id: number): Reflection | undefined;
    /**
     * Gets the reflection associated with the given symbol, if it exists.
     * @internal
     */
    getReflectionFromSymbol(symbol: ts.Symbol): Reflection | undefined;
    /** @internal */
    getSymbolFromReflection(reflection: Reflection): ts.Symbol | undefined;
    private getReferenceGraph;
}
