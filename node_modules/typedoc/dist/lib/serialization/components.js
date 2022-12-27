"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeSerializerComponent = exports.ReflectionSerializerComponent = exports.SerializerComponent = void 0;
const models_1 = require("../models");
/**
 * Represents Serializer plugin component.
 *
 * Like [[Converter]] plugins each [[Serializer]] plugin defines a predicate that instructs if an
 * object can be serialized by it, this is done dynamically at runtime via a `supports` method.
 *
 * Additionally, each [[Serializer]] plugin must define a predicate that instructs the group
 * it belongs to.
 *
 * Serializers are grouped to improve performance when finding serializers that apply to a node,
 * this makes it possible to skip the `supports` calls for `Type`s when searching for a
 * `Reflection` and vise versa.
 */
class SerializerComponent {
    constructor(owner) {
        this.owner = owner;
    }
    /**
     * The priority this serializer should be executed with.
     * A higher priority means the [[Serializer]] will be applied earlier.
     */
    get priority() {
        return (this.constructor["PRIORITY"] ||
            SerializerComponent.PRIORITY);
    }
}
exports.SerializerComponent = SerializerComponent;
/**
 * The priority this serializer should be executed with.
 * A higher priority means the [[Serializer]] will be applied earlier.
 */
SerializerComponent.PRIORITY = 0;
class ReflectionSerializerComponent extends SerializerComponent {
    /**
     * Filter for instances of [[Reflection]]
     */
    serializeGroup(instance) {
        return instance instanceof models_1.Reflection;
    }
}
exports.ReflectionSerializerComponent = ReflectionSerializerComponent;
class TypeSerializerComponent extends SerializerComponent {
    /**
     * Filter for instances of [[Type]]
     */
    serializeGroup(instance) {
        return instance instanceof models_1.Type;
    }
}
exports.TypeSerializerComponent = TypeSerializerComponent;
