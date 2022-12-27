"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReflectionGroup = void 0;
/**
 * A group of reflections. All reflections in a group are of the same kind.
 *
 * Reflection groups are created by the ´GroupHandler´ in the resolving phase
 * of the dispatcher. The main purpose of groups is to be able to more easily
 * render human readable children lists in templates.
 */
class ReflectionGroup {
    /**
     * Create a new ReflectionGroup instance.
     *
     * @param title The title of this group.
     * @param kind  The original typescript kind of the children of this group.
     */
    constructor(title, kind) {
        /**
         * All reflections of this group.
         */
        this.children = [];
        /**
         * Do all children of this group have a separate document?
         *
         * A bound representation of the ´ReflectionGroup.getAllChildrenHaveOwnDocument´
         * that can be used within templates.
         */
        this.allChildrenHaveOwnDocument = () => this.getAllChildrenHaveOwnDocument();
        this.title = title;
        this.kind = kind;
    }
    /**
     * Do all children of this group have a separate document?
     */
    getAllChildrenHaveOwnDocument() {
        return this.children.every((child) => child.hasOwnDocument);
    }
}
exports.ReflectionGroup = ReflectionGroup;
