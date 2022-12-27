import { ContainerReflection } from "../../../models";
import { ReflectionSerializerComponent } from "../../components";
import { ContainerReflection as JSONContainerReflection, Reflection as JSONReflection } from "../../schema";
export declare class ContainerReflectionSerializer extends ReflectionSerializerComponent<ContainerReflection> {
    supports(t: unknown): boolean;
    /**
     * Will be run after [[ReflectionSerializer]] so will be passed the result of that serialization.
     * @param container
     * @param obj
     */
    toObject(container: ContainerReflection, obj: JSONReflection): JSONContainerReflection;
}
