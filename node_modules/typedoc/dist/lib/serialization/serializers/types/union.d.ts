import { UnionType } from "../../../models";
import { TypeSerializerComponent } from "../../components";
import { UnionType as JSONUnionType } from "../../schema";
export declare class UnionTypeSerializer extends TypeSerializerComponent<UnionType> {
    supports(t: unknown): boolean;
    /**
     * Will be run after [[TypeSerializer]] so `type` will already be set.
     * @param type
     * @param obj
     */
    toObject(type: UnionType, obj: Pick<JSONUnionType, "type">): JSONUnionType;
}
