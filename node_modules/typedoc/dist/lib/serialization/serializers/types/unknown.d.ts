import { UnknownType } from "../../../models";
import { TypeSerializerComponent } from "../../components";
import { UnknownType as JSONUnknownType } from "../../schema";
export declare class UnknownTypeSerializer extends TypeSerializerComponent<UnknownType> {
    supports(t: unknown): boolean;
    /**
     * Will be run after [[TypeSerializer]] so `type` will already be set.
     * @param type
     * @param obj
     */
    toObject(type: UnknownType, obj: Pick<JSONUnknownType, "type">): JSONUnknownType;
}
