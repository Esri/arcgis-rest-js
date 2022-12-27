"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var GroupPlugin_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupPlugin = void 0;
const index_1 = require("../../models/reflections/index");
const ReflectionGroup_1 = require("../../models/ReflectionGroup");
const components_1 = require("../components");
const converter_1 = require("../converter");
const sort_1 = require("../../utils/sort");
const utils_1 = require("../../utils");
/**
 * A handler that sorts and groups the found reflections in the resolving phase.
 *
 * The handler sets the ´groups´ property of all reflections.
 */
let GroupPlugin = GroupPlugin_1 = class GroupPlugin extends components_1.ConverterComponent {
    /**
     * Create a new GroupPlugin instance.
     */
    initialize() {
        this.listenTo(this.owner, {
            [converter_1.Converter.EVENT_RESOLVE]: this.onResolve,
            [converter_1.Converter.EVENT_RESOLVE_END]: this.onEndResolve,
        });
    }
    /**
     * Triggered when the converter resolves a reflection.
     *
     * @param context  The context object describing the current state the converter is in.
     * @param reflection  The reflection that is currently resolved.
     */
    onResolve(_context, reflection) {
        reflection.kindString = GroupPlugin_1.getKindSingular(reflection.kind);
        if (reflection instanceof index_1.ContainerReflection) {
            this.group(reflection);
        }
    }
    /**
     * Triggered when the converter has finished resolving a project.
     *
     * @param context  The context object describing the current state the converter is in.
     */
    onEndResolve(context) {
        function walkDirectory(directory) {
            directory.groups = GroupPlugin_1.getReflectionGroups(directory.getAllReflections());
            for (const dir of Object.values(directory.directories)) {
                walkDirectory(dir);
            }
        }
        const project = context.project;
        this.group(project);
        walkDirectory(project.directory);
        project.files.forEach((file) => {
            file.groups = GroupPlugin_1.getReflectionGroups(file.reflections);
        });
    }
    group(reflection) {
        if (reflection.children &&
            reflection.children.length > 0 &&
            !reflection.groups) {
            (0, sort_1.sortReflections)(reflection.children, this.sortStrategies);
            reflection.groups = GroupPlugin_1.getReflectionGroups(reflection.children);
        }
    }
    /**
     * Create a grouped representation of the given list of reflections.
     *
     * Reflections are grouped by kind and sorted by weight and name.
     *
     * @param reflections  The reflections that should be grouped.
     * @returns An array containing all children of the given reflection grouped by their kind.
     */
    static getReflectionGroups(reflections) {
        const groups = [];
        reflections.forEach((child) => {
            for (let i = 0; i < groups.length; i++) {
                const group = groups[i];
                if (group.kind !== child.kind) {
                    continue;
                }
                group.children.push(child);
                return;
            }
            const group = new ReflectionGroup_1.ReflectionGroup(GroupPlugin_1.getKindPlural(child.kind), child.kind);
            group.children.push(child);
            groups.push(group);
        });
        groups.forEach((group) => {
            let allInherited = true;
            let allPrivate = true;
            let allProtected = true;
            let allExternal = true;
            group.children.forEach((child) => {
                allPrivate = child.flags.isPrivate && allPrivate;
                allProtected =
                    (child.flags.isPrivate || child.flags.isProtected) &&
                        allProtected;
                allExternal = child.flags.isExternal && allExternal;
                if (child instanceof index_1.DeclarationReflection) {
                    allInherited = !!child.inheritedFrom && allInherited;
                }
                else {
                    allInherited = false;
                }
            });
            group.allChildrenAreInherited = allInherited;
            group.allChildrenArePrivate = allPrivate;
            group.allChildrenAreProtectedOrPrivate = allProtected;
            group.allChildrenAreExternal = allExternal;
        });
        return groups;
    }
    /**
     * Transform the internal typescript kind identifier into a human readable version.
     *
     * @param kind  The original typescript kind identifier.
     * @returns A human readable version of the given typescript kind identifier.
     */
    static getKindString(kind) {
        let str = index_1.ReflectionKind[kind];
        str = str.replace(/(.)([A-Z])/g, (_m, a, b) => a + " " + b.toLowerCase());
        return str;
    }
    /**
     * Return the singular name of a internal typescript kind identifier.
     *
     * @param kind The original internal typescript kind identifier.
     * @returns The singular name of the given internal typescript kind identifier
     */
    static getKindSingular(kind) {
        if (kind in GroupPlugin_1.SINGULARS) {
            return GroupPlugin_1.SINGULARS[kind];
        }
        else {
            return GroupPlugin_1.getKindString(kind);
        }
    }
    /**
     * Return the plural name of a internal typescript kind identifier.
     *
     * @param kind The original internal typescript kind identifier.
     * @returns The plural name of the given internal typescript kind identifier
     */
    static getKindPlural(kind) {
        if (kind in GroupPlugin_1.PLURALS) {
            return GroupPlugin_1.PLURALS[kind];
        }
        else {
            return this.getKindString(kind) + "s";
        }
    }
};
/**
 * Define the singular name of individual reflection kinds.
 */
GroupPlugin.SINGULARS = {
    [index_1.ReflectionKind.Enum]: "Enumeration",
    [index_1.ReflectionKind.EnumMember]: "Enumeration member",
};
/**
 * Define the plural name of individual reflection kinds.
 */
GroupPlugin.PLURALS = {
    [index_1.ReflectionKind.Class]: "Classes",
    [index_1.ReflectionKind.Property]: "Properties",
    [index_1.ReflectionKind.Enum]: "Enumerations",
    [index_1.ReflectionKind.EnumMember]: "Enumeration members",
    [index_1.ReflectionKind.TypeAlias]: "Type aliases",
};
__decorate([
    (0, utils_1.BindOption)("sort")
], GroupPlugin.prototype, "sortStrategies", void 0);
GroupPlugin = GroupPlugin_1 = __decorate([
    (0, components_1.Component)({ name: "group" })
], GroupPlugin);
exports.GroupPlugin = GroupPlugin;
