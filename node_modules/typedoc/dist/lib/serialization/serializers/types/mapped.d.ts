import { TypeSerializerComponent } from "../../components";
import { MappedType } from "../../../models";
import { MappedType as JSONMappedType } from "../../schema";
export declare class MappedTypeSerializer extends TypeSerializerComponent<MappedType> {
    supports(t: unknown): boolean;
    toObject(map: MappedType, obj: Pick<JSONMappedType, "type">): JSONMappedType;
}
