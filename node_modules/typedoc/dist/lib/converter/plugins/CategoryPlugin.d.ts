import { Reflection } from "../../models";
import { ReflectionCategory } from "../../models/ReflectionCategory";
import { ConverterComponent } from "../components";
/**
 * A handler that sorts and categorizes the found reflections in the resolving phase.
 *
 * The handler sets the ´category´ property of all reflections.
 */
export declare class CategoryPlugin extends ConverterComponent {
    defaultCategory: string;
    categoryOrder: string[];
    categorizeByGroup: boolean;
    static defaultCategory: string;
    static WEIGHTS: string[];
    /**
     * Create a new CategoryPlugin instance.
     */
    initialize(): void;
    /**
     * Triggered when the converter begins converting a project.
     */
    private onBegin;
    /**
     * Triggered when the converter resolves a reflection.
     *
     * @param context  The context object describing the current state the converter is in.
     * @param reflection  The reflection that is currently resolved.
     */
    private onResolve;
    /**
     * Triggered when the converter has finished resolving a project.
     *
     * @param context  The context object describing the current state the converter is in.
     */
    private onEndResolve;
    private categorize;
    private groupCategorize;
    private lumpCategorize;
    /**
     * Create a categorized representation of the given list of reflections.
     *
     * @param reflections  The reflections that should be categorized.
     * @returns An array containing all children of the given reflection categorized
     */
    static getReflectionCategories(reflections: Reflection[]): ReflectionCategory[];
    /**
     * Return the category of a given reflection.
     *
     * @param reflection The reflection.
     * @returns The category the reflection belongs to
     */
    static getCategories(reflection: Reflection): Set<string>;
    /**
     * Callback used to sort categories by name.
     *
     * @param a The left reflection to sort.
     * @param b The right reflection to sort.
     * @returns The sorting weight.
     */
    static sortCatCallback(a: ReflectionCategory, b: ReflectionCategory): number;
}
