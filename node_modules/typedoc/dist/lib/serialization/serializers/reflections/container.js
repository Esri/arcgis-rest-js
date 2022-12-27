"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContainerReflectionSerializer = void 0;
const models_1 = require("../../../models");
const components_1 = require("../../components");
const models_2 = require("../models");
class ContainerReflectionSerializer extends components_1.ReflectionSerializerComponent {
    supports(t) {
        return t instanceof models_1.ContainerReflection;
    }
    /**
     * Will be run after [[ReflectionSerializer]] so will be passed the result of that serialization.
     * @param container
     * @param obj
     */
    toObject(container, obj) {
        var _a;
        return {
            ...obj,
            children: this.owner.toObject(container.children),
            groups: this.owner.toObject(container.groups),
            categories: this.owner.toObject(container.categories),
            sources: this.owner.toObject((_a = container.sources) === null || _a === void 0 ? void 0 : _a.map((s) => new models_2.SourceReferenceWrapper(s))),
        };
    }
}
exports.ContainerReflectionSerializer = ContainerReflectionSerializer;
