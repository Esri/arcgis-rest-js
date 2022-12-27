import { EventDispatcher } from "../utils";
import { ProjectReflection } from "../models";
import { SerializerComponent } from "./components";
import { SerializeEventData } from "./events";
import { ModelToObject } from "./schema";
export declare class Serializer extends EventDispatcher {
    /**
     * Triggered when the [[Serializer]] begins transforming a project.
     * @event EVENT_BEGIN
     */
    static EVENT_BEGIN: string;
    /**
     * Triggered when the [[Serializer]] has finished transforming a project.
     * @event EVENT_END
     */
    static EVENT_END: string;
    /**
     * Serializers, sorted by their `serializeGroup` function to enable higher performance.
     */
    private serializers;
    constructor();
    addSerializer(serializer: SerializerComponent<any>): void;
    toObject<T>(value: T, init?: object): ModelToObject<T>;
    /**
     * Same as toObject but emits [[ Serializer#EVENT_BEGIN ]] and [[ Serializer#EVENT_END ]] events.
     * @param value
     * @param eventData Partial information to set in the event
     */
    projectToObject(value: ProjectReflection, eventData?: {
        begin?: SerializeEventData;
        end?: SerializeEventData;
    }): ModelToObject<ProjectReflection>;
    private findSerializers;
}
