"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SourceReferenceContainerSerializer = void 0;
const components_1 = require("../../components");
const models_1 = require("../models");
class SourceReferenceContainerSerializer extends components_1.SerializerComponent {
    serializeGroup(instance) {
        return instance instanceof models_1.SourceReferenceWrapper;
    }
    supports() {
        return true;
    }
    toObject({ sourceReference: ref }, obj) {
        return {
            ...obj,
            fileName: ref.fileName,
            line: ref.line,
            character: ref.character,
        };
    }
}
exports.SourceReferenceContainerSerializer = SourceReferenceContainerSerializer;
SourceReferenceContainerSerializer.PRIORITY = 1000;
