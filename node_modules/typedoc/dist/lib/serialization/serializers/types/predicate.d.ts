import { PredicateType } from "../../../models";
import { TypeSerializerComponent } from "../../components";
import { PredicateType as JSONPredicateType } from "../../schema";
export declare class PredicateTypeSerializer extends TypeSerializerComponent<PredicateType> {
    supports(t: unknown): boolean;
    toObject(type: PredicateType, obj: Pick<JSONPredicateType, "type">): JSONPredicateType;
}
