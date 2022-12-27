"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SerializeEvent = void 0;
const events_1 = require("../utils/events");
/**
 * An event emitted by the [[Serializer]] class at the very beginning and
 * ending of the a project serialization process.
 *
 * @see [[Serializer.EVENT_BEGIN]]
 * @see [[Serializer.EVENT_END]]
 */
class SerializeEvent extends events_1.Event {
    constructor(name, project, output) {
        super(name);
        this.project = project;
        this.output = output;
    }
}
exports.SerializeEvent = SerializeEvent;
