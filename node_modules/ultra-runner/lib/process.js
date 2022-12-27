"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onProcessExit = void 0;
function onProcessExit(listener, forceExit = true) {
    ;
    ["SIGTERM", "SIGINT"].forEach((event) => process.once(event, (signal) => {
        listener(signal);
        if (forceExit)
            process.exit(1);
    }));
    process.once("exit", () => listener("exit"));
}
exports.onProcessExit = onProcessExit;
//# sourceMappingURL=process.js.map