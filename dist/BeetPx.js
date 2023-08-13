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
    // field-like getters, the ones meant to be used
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
    //
    // field-like getters, the ones that shouldn't be needed in theory, but in practice they are ¯\_(ツ)_/¯
    //
    static get audioContext() {
        return __classPrivateFieldGet(this, _a, "m", _BeetPx_tryGetFramework).call(this).audioApi.audioContext;
    }
    static get globalGainNode() {
        return __classPrivateFieldGet(this, _a, "m", _BeetPx_tryGetFramework).call(this).audioApi.globalGainNode;
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
// Buttons
//
BeetPx.isPressed = (...args) => {
    return __classPrivateFieldGet(_a, _a, "m", _BeetPx_tryGetFramework).call(_a).buttons.isPressed(...args);
};
BeetPx.setRepeating = (...args) => {
    return __classPrivateFieldGet(_a, _a, "m", _BeetPx_tryGetFramework).call(_a).buttons.setRepeating(...args);
};
BeetPx.wasJustPressed = (...args) => {
    return __classPrivateFieldGet(_a, _a, "m", _BeetPx_tryGetFramework).call(_a).buttons.wasJustPressed(...args);
};
BeetPx.wasJustReleased = (...args) => {
    return __classPrivateFieldGet(_a, _a, "m", _BeetPx_tryGetFramework).call(_a).buttons.wasJustReleased(...args);
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
BeetPx.removeClippingRegion = (...args) => {
    return __classPrivateFieldGet(_a, _a, "m", _BeetPx_tryGetFramework).call(_a).drawApi.removeClippingRegion(...args);
};
BeetPx.setFillPattern = (...args) => {
    return __classPrivateFieldGet(_a, _a, "m", _BeetPx_tryGetFramework).call(_a).drawApi.setFillPattern(...args);
};
BeetPx.mapSpriteColors = (...args) => {
    return __classPrivateFieldGet(_a, _a, "m", _BeetPx_tryGetFramework).call(_a).drawApi.mapSpriteColors(...args);
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
// TODO: make sure the whole API gets nice JSDoc even shown in the game itself, in IDE
BeetPx.sprite = (...args) => {
    return __classPrivateFieldGet(_a, _a, "m", _BeetPx_tryGetFramework).call(_a).drawApi.sprite(...args);
};
// TODO: Create a similar JSDocs API description for other API methods as well
/**
 * Draws a text on the canvas
 *
 * @param text
 * @param canvasXy1 top-left text corner
 * @param color text color or a function which returns a text color for a given character
 */
BeetPx.print = (text, canvasXy1, color) => {
    return __classPrivateFieldGet(_a, _a, "m", _BeetPx_tryGetFramework).call(_a).drawApi.print(text, canvasXy1, color);
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
BeetPx.playSoundSequence = (...args) => {
    return __classPrivateFieldGet(_a, _a, "m", _BeetPx_tryGetFramework).call(_a).audioApi.playSoundSequence(...args);
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
//
// Assets (not really needed, unless it is needed for some reason ¯\_(ツ)_/¯ )
//
BeetPx.getImageAsset = (...args) => {
    return __classPrivateFieldGet(_a, _a, "m", _BeetPx_tryGetFramework).call(_a).assets.getImageAsset(...args);
};
BeetPx.getFontAsset = (...args) => {
    return __classPrivateFieldGet(_a, _a, "m", _BeetPx_tryGetFramework).call(_a).assets.getFontAsset(...args);
};
BeetPx.getSoundAsset = (...args) => {
    return __classPrivateFieldGet(_a, _a, "m", _BeetPx_tryGetFramework).call(_a).assets.getSoundAsset(...args);
};
