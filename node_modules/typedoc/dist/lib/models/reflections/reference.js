"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReferenceReflection = void 0;
const abstract_1 = require("./abstract");
const declaration_1 = require("./declaration");
/**
 * Describes a reflection which does not exist at this location, but is referenced. Used for imported reflections.
 *
 * ```ts
 * // a.ts
 * export const a = 1;
 * // b.ts
 * import { a } from './a';
 * // Here to avoid extra work we create a reference to the original reflection in module a instead
 * // of copying the reflection.
 * export { a };
 * ```
 */
class ReferenceReflection extends declaration_1.DeclarationReflection {
    /**
     * Creates a reference reflection. Should only be used within the factory function.
     * @param name
     * @param state
     * @param parent
     *
     * @internal
     */
    constructor(name, state, parent) {
        super(name, abstract_1.ReflectionKind.Reference, parent);
        this._target = state;
    }
    /**
     * Helper to check if this reflection is a reference for themes.
     */
    get isReference() {
        return true;
    }
    /**
     * Tries to get the reflection that is referenced. This may be another reference reflection.
     * To fully resolve any references, use [[tryGetTargetReflectionDeep]].
     */
    tryGetTargetReflection() {
        this._ensureProject();
        if (this._target instanceof abstract_1.Reflection) {
            return this._target;
        }
        const target = this._project.getReflectionFromSymbol(this._target);
        if (target)
            this._target = target;
        return target;
    }
    /**
     * Tries to get the reflection that is referenced, this will fully resolve references.
     * To only resolve one reference, use [[tryGetTargetReflection]].
     */
    tryGetTargetReflectionDeep() {
        let result = this.tryGetTargetReflection();
        while (result instanceof ReferenceReflection) {
            result = result.tryGetTargetReflection();
        }
        return result;
    }
    /**
     * Gets the reflection that is referenced. This may be another reference reflection.
     * To fully resolve any references, use [[getTargetReflectionDeep]].
     */
    getTargetReflection() {
        this._ensureProject();
        const target = this.tryGetTargetReflection();
        if (!target) {
            throw new Error("Reference was unresolved.");
        }
        return target;
    }
    /**
     * Gets the reflection that is referenced, this will fully resolve references.
     * To only resolve one reference, use [[getTargetReflection]].
     */
    getTargetReflectionDeep() {
        let result = this.getTargetReflection();
        while (result instanceof ReferenceReflection) {
            result = result.getTargetReflection();
        }
        return result;
    }
    _ensureProject() {
        if (this._project) {
            return;
        }
        let project = this.parent;
        while (project && !project.isProject()) {
            project = project.parent;
        }
        this._project = project;
        if (!this._project) {
            throw new Error("Reference reflection has no project and is unable to resolve.");
        }
    }
}
exports.ReferenceReflection = ReferenceReflection;
