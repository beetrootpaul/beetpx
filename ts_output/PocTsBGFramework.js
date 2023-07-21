"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _a, _PocTsBGFramework_framework;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PocTsBGFramework = void 0;
const Framework_1 = require("./Framework");
//  This class is only a facade over other capabilities of this game framework.
//    It serves as a public, global, statically accessible API.
//    Inspiration: [PICO-8's API](https://www.lexaloffle.com/dl/docs/pico-8_manual.html).
// TODO: flatten to have to use a single dot only. Flat API is OK
// TODO: review the whole public API and rename from the usage point of view
// TODO: after name for the framework gets chosen: rename this to the framework name or to its abbreviation
class PocTsBGFramework {
    // The most important function, has to be called first in order
    //   to properly initialize other fields and variables.
    //
    // TODO: type the startGame fn or the entire object inside resolved Promise
    static init(frameworkOptions, assetsToLoad) {
        __classPrivateFieldSet(PocTsBGFramework, _a, new Framework_1.Framework(frameworkOptions), "f", _PocTsBGFramework_framework);
        return __classPrivateFieldGet(PocTsBGFramework, _a, "f", _PocTsBGFramework_framework).loadAssets(assetsToLoad);
    }
    // Framework's lifecycle methods, exposed for a static access.
    //   Assumption: `init(…)` was called first in order to make `framework` defined.
    //
    static setOnUpdate(onUpdate) {
        __classPrivateFieldGet(PocTsBGFramework, _a, "f", _PocTsBGFramework_framework).setOnUpdate(onUpdate);
    }
    static setOnDraw(onDraw) {
        __classPrivateFieldGet(PocTsBGFramework, _a, "f", _PocTsBGFramework_framework).setOnDraw(onDraw);
    }
    // Debug flag.
    //
    static get debug() {
        return __classPrivateFieldGet(PocTsBGFramework, _a, "f", _PocTsBGFramework_framework).debug;
    }
}
exports.PocTsBGFramework = PocTsBGFramework;
_a = PocTsBGFramework;
_PocTsBGFramework_framework = { value: void 0 };
// The rest of the globally and statically available API.
//   Assumption: `init(…)` was called first in order to make `framework` defined.
//
PocTsBGFramework.frameNumber = 0;
PocTsBGFramework.averageFps = 1;
