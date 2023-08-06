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
var _a, _BeetPx_framework, _BeetPx_tryGetFramework;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BeetPx = void 0;
const Framework_1 = require("./Framework");
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
        return __classPrivateFieldGet(this, _a, "m", _BeetPx_tryGetFramework).call(this).frameNumber;
    }
    static get averageFps() {
        return __classPrivateFieldGet(this, _a, "m", _BeetPx_tryGetFramework).call(this).averageFps;
    }
    static get continuousInputEvents() {
        return __classPrivateFieldGet(this, _a, "m", _BeetPx_tryGetFramework).call(this).continuousInputEvents;
    }
    static get fireOnceInputEvents() {
        return __classPrivateFieldGet(this, _a, "m", _BeetPx_tryGetFramework).call(this).fireOnceInputEvents;
    }
    static get audioContext() {
        return __classPrivateFieldGet(this, _a, "m", _BeetPx_tryGetFramework).call(this).audioApi.audioContext;
    }
    static get debug() {
        return __classPrivateFieldGet(this, _a, "m", _BeetPx_tryGetFramework).call(this).debug;
    }
}
exports.BeetPx = BeetPx;
_a = BeetPx, _BeetPx_tryGetFramework = function _BeetPx_tryGetFramework() {
    if (!__classPrivateFieldGet(this, _a, "f", _BeetPx_framework)) {
        throw Error(`Tried to access BeetPx API without calling BeetPx.init(…) first.`);
    }
    return __classPrivateFieldGet(this, _a, "f", _BeetPx_framework);
};
_BeetPx_framework = { value: void 0 };
//
// lifecycle methods
//
BeetPx.setOnUpdate = (...args) => {
    return __classPrivateFieldGet(_a, _a, "m", _BeetPx_tryGetFramework).call(_a).setOnUpdate(...args);
};
BeetPx.setOnDraw = (...args) => {
    return __classPrivateFieldGet(_a, _a, "m", _BeetPx_tryGetFramework).call(_a).setOnDraw(...args);
};
//
// Draw API
//
BeetPx.setCameraOffset = (...args) => {
    return __classPrivateFieldGet(_a, _a, "m", _BeetPx_tryGetFramework).call(_a).drawApi.setCameraOffset(...args);
};
BeetPx.setClippingRegion = (...args) => {
    return __classPrivateFieldGet(_a, _a, "m", _BeetPx_tryGetFramework).call(_a).drawApi.setClippingRegion(...args);
};
BeetPx.setFillPattern = (...args) => {
    return __classPrivateFieldGet(_a, _a, "m", _BeetPx_tryGetFramework).call(_a).drawApi.setFillPattern(...args);
};
BeetPx.mapSpriteColors = (...args) => {
    return __classPrivateFieldGet(_a, _a, "m", _BeetPx_tryGetFramework).call(_a).drawApi.mapSpriteColors(...args);
};
BeetPx.getMappedSpriteColor = (...args) => {
    return __classPrivateFieldGet(_a, _a, "m", _BeetPx_tryGetFramework).call(_a).drawApi.getMappedSpriteColor(...args);
};
BeetPx.setFont = (...args) => {
    return __classPrivateFieldGet(_a, _a, "m", _BeetPx_tryGetFramework).call(_a).drawApi.setFont(...args);
};
BeetPx.getFont = (...args) => {
    return __classPrivateFieldGet(_a, _a, "m", _BeetPx_tryGetFramework).call(_a).drawApi.getFont(...args);
};
BeetPx.clearCanvas = (...args) => {
    return __classPrivateFieldGet(_a, _a, "m", _BeetPx_tryGetFramework).call(_a).drawApi.clearCanvas(...args);
};
BeetPx.pixel = (...args) => {
    return __classPrivateFieldGet(_a, _a, "m", _BeetPx_tryGetFramework).call(_a).drawApi.pixel(...args);
};
BeetPx.line = (...args) => {
    return __classPrivateFieldGet(_a, _a, "m", _BeetPx_tryGetFramework).call(_a).drawApi.line(...args);
};
BeetPx.rect = (...args) => {
    return __classPrivateFieldGet(_a, _a, "m", _BeetPx_tryGetFramework).call(_a).drawApi.rect(...args);
};
BeetPx.rectFilled = (...args) => {
    return __classPrivateFieldGet(_a, _a, "m", _BeetPx_tryGetFramework).call(_a).drawApi.rectFilled(...args);
};
BeetPx.ellipse = (...args) => {
    return __classPrivateFieldGet(_a, _a, "m", _BeetPx_tryGetFramework).call(_a).drawApi.ellipse(...args);
};
BeetPx.ellipseFilled = (...args) => {
    return __classPrivateFieldGet(_a, _a, "m", _BeetPx_tryGetFramework).call(_a).drawApi.ellipseFilled(...args);
};
BeetPx.sprite = (...args) => {
    return __classPrivateFieldGet(_a, _a, "m", _BeetPx_tryGetFramework).call(_a).drawApi.sprite(...args);
};
BeetPx.print = (...args) => {
    return __classPrivateFieldGet(_a, _a, "m", _BeetPx_tryGetFramework).call(_a).drawApi.print(...args);
};
//
// Audio API
//
BeetPx.toggleMuteUnmute = (...args) => {
    return __classPrivateFieldGet(_a, _a, "m", _BeetPx_tryGetFramework).call(_a).audioApi.toggleMuteUnmute(...args);
};
BeetPx.playSoundOnce = (...args) => {
    return __classPrivateFieldGet(_a, _a, "m", _BeetPx_tryGetFramework).call(_a).audioApi.playSoundOnce(...args);
};
BeetPx.playSoundLooped = (...args) => {
    return __classPrivateFieldGet(_a, _a, "m", _BeetPx_tryGetFramework).call(_a).audioApi.playSoundLooped(...args);
};
BeetPx.muteSound = (...args) => {
    return __classPrivateFieldGet(_a, _a, "m", _BeetPx_tryGetFramework).call(_a).audioApi.muteSound(...args);
};
BeetPx.unmuteSound = (...args) => {
    return __classPrivateFieldGet(_a, _a, "m", _BeetPx_tryGetFramework).call(_a).audioApi.unmuteSound(...args);
};
//
// Storage API
//
BeetPx.store = (...args) => {
    return __classPrivateFieldGet(_a, _a, "m", _BeetPx_tryGetFramework).call(_a).storageApi.store(...args);
};
BeetPx.load = (...args) => {
    return __classPrivateFieldGet(_a, _a, "m", _BeetPx_tryGetFramework).call(_a).storageApi.load(...args);
};
BeetPx.clearStorage = (...args) => {
    return __classPrivateFieldGet(_a, _a, "m", _BeetPx_tryGetFramework).call(_a).storageApi.clearStorage(...args);
};
