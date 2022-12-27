import { LiteralType } from "../../../models";
import { TypeSerializerComponent } from "../../components";
import { LiteralType as JSONLiteralType } from "../../schema";
export declare class LiteralTypeSerializer extends TypeSerializerComponent<LiteralType> {
    supports(t: unknown): boolean;
    toObject(type: LiteralType, obj: Pick<JSONLiteralType, "type">): JSONLiteralType;
}
