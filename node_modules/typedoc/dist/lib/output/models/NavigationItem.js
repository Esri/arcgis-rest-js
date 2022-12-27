"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NavigationItem = void 0;
/**
 * A hierarchical model holding the data of single node within the navigation.
 *
 * This structure is used by the [[NavigationPlugin]] and [[TocPlugin]] to expose the current
 * navigation state to the template engine. Themes should generate the primary navigation structure
 * through the [[BaseTheme.getNavigation]] method.
 */
class NavigationItem {
    /**
     * Create a new NavigationItem instance.
     *
     * @param title       The visible title of the navigation node.
     * @param url         The url this navigation node points to.
     * @param parent      The parent navigation node.
     * @param cssClasses  A string containing the css classes of this node.
     * @param reflection  The source [Reflection] for this [NavigationItem]
     */
    constructor(title, url, parent, cssClasses, reflection) {
        this.title = title || "";
        this.url = url || "";
        this.parent = parent;
        this.cssClasses = cssClasses || "";
        this.reflection = reflection;
        if (!url) {
            this.isLabel = true;
        }
        if (this.parent) {
            if (!this.parent.children) {
                this.parent.children = [];
            }
            this.parent.children.push(this);
        }
    }
    /**
     * Create a navigation node for the given reflection.
     *
     * @param reflection     The reflection whose navigation node should be created.
     * @param parent         The parent navigation node.
     * @param useShortNames  Force this function to always use short names.
     */
    static create(reflection, parent, useShortNames) {
        let name;
        if (useShortNames || (parent && parent.parent)) {
            name = reflection.name;
        }
        else {
            name = reflection.getFullName();
        }
        name = name.trim();
        if (name === "") {
            name = `<em>${reflection.kindString}</em>`;
        }
        return new NavigationItem(name, reflection.url, parent, reflection.cssClasses, reflection);
    }
}
exports.NavigationItem = NavigationItem;
