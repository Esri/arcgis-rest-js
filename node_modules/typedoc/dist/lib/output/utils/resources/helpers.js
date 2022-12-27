"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HelperStack = exports.Helper = void 0;
const Path = require("path");
const Handlebars = require("handlebars");
const stack_1 = require("./stack");
class Helper extends stack_1.Resource {
    getHelpers() {
        if (!this.helpers) {
            // eslint-disable-next-line
            const file = require(this.fileName);
            if (typeof file === "object") {
                this.helpers = file;
            }
            else if (typeof file === "function") {
                this.helpers = file();
            }
            else {
                throw new Error("Invalid helper.");
            }
        }
        return this.helpers;
    }
}
exports.Helper = Helper;
class HelperStack extends stack_1.ResourceStack {
    constructor() {
        // Include .ts files so that tests run with ts-node work.
        // Exclude .d.ts files so that declaration files are not included after compilation.
        // Once lookbehind assertions are supported by all supported Node versions replace with /(?<!\.d)\.ts$|\.js$/
        super(Helper, /((?!\.d).{2}|^.{0,1})\.ts$|\.js$/);
        this.registeredNames = [];
        this.addCoreHelpers();
    }
    activate() {
        if (!super.activate()) {
            return false;
        }
        const resources = this.getAllResources();
        for (const resourceName in resources) {
            const helpers = resources[resourceName].getHelpers();
            for (const name in helpers) {
                if (this.registeredNames.includes(name)) {
                    continue;
                }
                this.registeredNames.push(name);
                Handlebars.registerHelper(name, helpers[name]);
            }
        }
        return true;
    }
    deactivate() {
        if (!super.deactivate()) {
            return false;
        }
        for (const name of this.registeredNames) {
            Handlebars.unregisterHelper(name);
        }
        this.registeredNames = [];
        return true;
    }
    addCoreHelpers() {
        this.addOrigin("core", Path.join(__dirname, "..", "..", "helpers"));
    }
    removeAllOrigins() {
        super.removeAllOrigins();
        this.addCoreHelpers();
    }
}
exports.HelperStack = HelperStack;
