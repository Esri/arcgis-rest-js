"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Serializer = void 0;
const utils_1 = require("../utils");
const events_1 = require("./events");
const S = require("./serializers");
class Serializer extends utils_1.EventDispatcher {
    constructor() {
        super();
        /**
         * Serializers, sorted by their `serializeGroup` function to enable higher performance.
         */
        this.serializers = new Map();
        addSerializers(this);
    }
    addSerializer(serializer) {
        let group = this.serializers.get(serializer.serializeGroup);
        if (!group) {
            this.serializers.set(serializer.serializeGroup, (group = []));
        }
        group.push(serializer);
        group.sort((a, b) => b.priority - a.priority);
    }
    toObject(value, init = {}) {
        if (value == null || typeof value !== "object") {
            return value; // Serializing some primitive
        }
        if (Array.isArray(value)) {
            if (value.length === 0) {
                return undefined;
            }
            return value.map((val) => this.toObject(val));
        }
        // Note: This type *could* potentially lie, if a serializer declares a partial type but fails to provide
        // the defined property, but the benefit of being mostly typed is probably worth it.
        // TypeScript errors out if init is correctly typed as `Partial<ModelToObject<T>>`
        return this.findSerializers(value).reduce((result, curr) => curr.toObject(value, result), init);
    }
    /**
     * Same as toObject but emits [[ Serializer#EVENT_BEGIN ]] and [[ Serializer#EVENT_END ]] events.
     * @param value
     * @param eventData Partial information to set in the event
     */
    projectToObject(value, eventData = {}) {
        const eventBegin = new events_1.SerializeEvent(Serializer.EVENT_BEGIN, value, {});
        if (eventData.begin) {
            eventBegin.outputDirectory = eventData.begin.outputDirectory;
            eventBegin.outputFile = eventData.begin.outputFile;
        }
        this.trigger(eventBegin);
        const project = this.toObject(value, eventBegin.output);
        const eventEnd = new events_1.SerializeEvent(Serializer.EVENT_END, value, project);
        if (eventData.end) {
            eventBegin.outputDirectory = eventData.end.outputDirectory;
            eventBegin.outputFile = eventData.end.outputFile;
        }
        this.trigger(eventEnd);
        return project;
    }
    findSerializers(value) {
        const routes = [];
        for (const [groupSupports, components] of this.serializers.entries()) {
            if (groupSupports(value)) {
                for (const component of components) {
                    if (component.supports(value)) {
                        routes.push(component);
                    }
                }
            }
        }
        return routes;
    }
}
exports.Serializer = Serializer;
/**
 * Triggered when the [[Serializer]] begins transforming a project.
 * @event EVENT_BEGIN
 */
Serializer.EVENT_BEGIN = "begin";
/**
 * Triggered when the [[Serializer]] has finished transforming a project.
 * @event EVENT_END
 */
Serializer.EVENT_END = "end";
const serializerComponents = [
    S.CommentTagSerializer,
    S.CommentSerializer,
    S.ReflectionSerializer,
    S.ReferenceReflectionSerializer,
    S.ContainerReflectionSerializer,
    S.DeclarationReflectionSerializer,
    S.ParameterReflectionSerializer,
    S.SignatureReflectionSerializer,
    S.TypeParameterReflectionSerializer,
    S.SourceReferenceContainerSerializer,
    S.TypeSerializer,
    S.ArrayTypeSerializer,
    S.ConditionalTypeSerializer,
    S.IndexedAccessTypeSerializer,
    S.InferredTypeSerializer,
    S.IntersectionTypeSerializer,
    S.IntrinsicTypeSerializer,
    S.OptionalTypeSerializer,
    S.PredicateTypeSerializer,
    S.QueryTypeSerializer,
    S.ReferenceTypeSerializer,
    S.ReferenceTypeSerializer,
    S.ReflectionTypeSerializer,
    S.RestTypeSerializer,
    S.LiteralTypeSerializer,
    S.TupleTypeSerializer,
    S.TemplateLiteralTypeSerializer,
    S.NamedTupleMemberTypeSerializer,
    S.MappedTypeSerializer,
    S.TypeOperatorTypeSerializer,
    S.TypeParameterTypeSerializer,
    S.UnionTypeSerializer,
    S.UnknownTypeSerializer,
    S.DecoratorContainerSerializer,
    S.ReflectionCategorySerializer,
    S.ReflectionGroupSerializer,
];
function addSerializers(owner) {
    for (const component of serializerComponents) {
        owner.addSerializer(new component(owner));
    }
}
