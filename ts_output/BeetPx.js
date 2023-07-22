"use strict";
// noinspection JSUnusedGlobalSymbols
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
var _a, _BeetPx_framework;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BeetPx = void 0;
const Framework_1 = require("./Framework");
//  This class is only a facade over other capabilities of this game framework.
//    It serves as a public, global, statically accessible API.
//    Inspiration: [PICO-8's API](https://www.lexaloffle.com/dl/docs/pico-8_manual.html).
class BeetPx {
    //
    // The most important function, _has to be called first_ in order to properly initialize other fields and variables.
    //
    static init(frameworkOptions, assetsToLoad) {
        __classPrivateFieldSet(this, _a, new Framework_1.Framework(frameworkOptions), "f", _BeetPx_framework);
        return __classPrivateFieldGet(this, _a, "f", _BeetPx_framework).loadAssets(assetsToLoad);
    }
    //
    // field-like getters
    //
    static get frameNumber() {
        return __classPrivateFieldGet(BeetPx, _a, "f", _BeetPx_framework).frameNumber;
    }
    static get averageFps() {
        return __classPrivateFieldGet(BeetPx, _a, "f", _BeetPx_framework).averageFps;
    }
    static get continuousInputEvents() {
        return __classPrivateFieldGet(BeetPx, _a, "f", _BeetPx_framework).continuousInputEvents;
    }
    static get fireOnceInputEvents() {
        return __classPrivateFieldGet(BeetPx, _a, "f", _BeetPx_framework).fireOnceInputEvents;
    }
    static get audioContext() {
        return __classPrivateFieldGet(this, _a, "f", _BeetPx_framework).audioApi.audioContext;
    }
    static get debug() {
        return __classPrivateFieldGet(BeetPx, _a, "f", _BeetPx_framework).debug;
    }
}
exports.BeetPx = BeetPx;
_a = BeetPx;
_BeetPx_framework = { value: void 0 };
//
// lifecycle methods
//
BeetPx.setOnUpdate = (...args) => {
    return __classPrivateFieldGet(_a, _a, "f", _BeetPx_framework).setOnUpdate(...args);
};
BeetPx.setOnDraw = (...args) => {
    return __classPrivateFieldGet(_a, _a, "f", _BeetPx_framework).setOnDraw(...args);
};
//
// Draw API
//
BeetPx.setCameraOffset = (...args) => {
    return __classPrivateFieldGet(_a, _a, "f", _BeetPx_framework).drawApi.setCameraOffset(...args);
};
BeetPx.setFillPattern = (...args) => {
    return __classPrivateFieldGet(_a, _a, "f", _BeetPx_framework).drawApi.setFillPattern(...args);
};
BeetPx.mapSpriteColor = (...args) => {
    return __classPrivateFieldGet(_a, _a, "f", _BeetPx_framework).drawApi.mapSpriteColor(...args);
};
BeetPx.setFont = (...args) => {
    return __classPrivateFieldGet(_a, _a, "f", _BeetPx_framework).drawApi.setFont(...args);
};
BeetPx.getFont = (...args) => {
    return __classPrivateFieldGet(_a, _a, "f", _BeetPx_framework).drawApi.getFont(...args);
};
BeetPx.clearCanvas = (...args) => {
    return __classPrivateFieldGet(_a, _a, "f", _BeetPx_framework).drawApi.clearCanvas(...args);
};
BeetPx.pixel = (...args) => {
    return __classPrivateFieldGet(_a, _a, "f", _BeetPx_framework).drawApi.pixel(...args);
};
BeetPx.rect = (...args) => {
    return __classPrivateFieldGet(_a, _a, "f", _BeetPx_framework).drawApi.rect(...args);
};
BeetPx.rectFilled = (...args) => {
    return __classPrivateFieldGet(_a, _a, "f", _BeetPx_framework).drawApi.rectFilled(...args);
};
BeetPx.ellipse = (...args) => {
    return __classPrivateFieldGet(_a, _a, "f", _BeetPx_framework).drawApi.ellipse(...args);
};
BeetPx.ellipseFilled = (...args) => {
    return __classPrivateFieldGet(_a, _a, "f", _BeetPx_framework).drawApi.ellipseFilled(...args);
};
BeetPx.sprite = (...args) => {
    return __classPrivateFieldGet(_a, _a, "f", _BeetPx_framework).drawApi.sprite(...args);
};
BeetPx.print = (...args) => {
    return __classPrivateFieldGet(_a, _a, "f", _BeetPx_framework).drawApi.print(...args);
};
//
// Audio API
//
BeetPx.toggleMuteUnmute = (...args) => {
    return __classPrivateFieldGet(_a, _a, "f", _BeetPx_framework).audioApi.toggleMuteUnmute(...args);
};
BeetPx.playSoundOnce = (...args) => {
    return __classPrivateFieldGet(_a, _a, "f", _BeetPx_framework).audioApi.playSoundOnce(...args);
};
BeetPx.playSoundLooped = (...args) => {
    return __classPrivateFieldGet(_a, _a, "f", _BeetPx_framework).audioApi.playSoundLooped(...args);
};
BeetPx.muteSound = (...args) => {
    return __classPrivateFieldGet(_a, _a, "f", _BeetPx_framework).audioApi.muteSound(...args);
};
BeetPx.unmuteSound = (...args) => {
    return __classPrivateFieldGet(_a, _a, "f", _BeetPx_framework).audioApi.unmuteSound(...args);
};
//
// Storage API
//
BeetPx.store = (...args) => {
    return __classPrivateFieldGet(_a, _a, "f", _BeetPx_framework).storageApi.store(...args);
};
BeetPx.load = (...args) => {
    return __classPrivateFieldGet(_a, _a, "f", _BeetPx_framework).storageApi.load(...args);
};
BeetPx.clearStorage = (...args) => {
    return __classPrivateFieldGet(_a, _a, "f", _BeetPx_framework).storageApi.clearStorage(...args);
};
