import { ReflectionCategory } from "../../models/ReflectionCategory";
import { SerializerComponent } from "../components";
import { ReflectionCategory as JSONReflectionCategory } from "../schema";
export declare class ReflectionCategorySerializer extends SerializerComponent<ReflectionCategory> {
    static PRIORITY: number;
    /**
     * Filter for instances of [[ReflectionCategory]]
     */
    serializeGroup(instance: unknown): boolean;
    supports(r: unknown): boolean;
    toObject(category: ReflectionCategory, obj?: Partial<JSONReflectionCategory>): JSONReflectionCategory;
}
