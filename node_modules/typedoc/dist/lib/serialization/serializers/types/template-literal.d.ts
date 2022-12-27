import { TemplateLiteralType } from "../../../models";
import { TypeSerializerComponent } from "../../components";
import { TemplateLiteralType as JSONTemplateLiteralType } from "../../schema";
export declare class TemplateLiteralTypeSerializer extends TypeSerializerComponent<TemplateLiteralType> {
    supports(t: unknown): boolean;
    toObject(type: TemplateLiteralType, obj: Pick<JSONTemplateLiteralType, "type">): JSONTemplateLiteralType;
}
