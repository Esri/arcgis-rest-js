"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SourceFile = void 0;
const Path = require("path");
/**
 * Exposes information about a source file.
 *
 * One my access a list of all source files through the [[ProjectReflection.files]] property or as
 * a tree structure through the [[ProjectReflection.directory]] property.
 *
 * Furthermore each reflection carries references to the related SourceFile with their
 * [[DeclarationReflection.sources]] property. It is an array of of [[IDeclarationSource]] instances
 * containing the reference in their [[IDeclarationSource.file]] field.
 */
class SourceFile {
    /**
     * Create a new SourceFile instance.
     *
     * @param fullFileName  The full file name.
     */
    constructor(fullFileName) {
        /**
         * A list of all reflections that are declared in this file.
         */
        this.reflections = [];
        this.fileName = fullFileName;
        this.fullFileName = fullFileName;
        this.name = Path.basename(fullFileName);
    }
}
exports.SourceFile = SourceFile;
