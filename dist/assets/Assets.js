var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Assets_images, _Assets_fonts, _Assets_sounds, _Assets_jsons;
import { BpxUtils } from "../Utils";
export class Assets {
    constructor() {
        _Assets_images.set(this, new Map());
        _Assets_fonts.set(this, new Map());
        _Assets_sounds.set(this, new Map());
        _Assets_jsons.set(this, new Map());
    }
    addImageAsset(imageUrl, imageAsset) {
        __classPrivateFieldGet(this, _Assets_images, "f").set(imageUrl, imageAsset);
    }
    addFontAsset(fontId, fontProps) {
        __classPrivateFieldGet(this, _Assets_fonts, "f").set(fontId, fontProps);
    }
    addSoundAsset(soundUrl, soundAsset) {
        __classPrivateFieldGet(this, _Assets_sounds, "f").set(soundUrl, soundAsset);
    }
    addJsonAsset(jsonUrl, jsonAsset) {
        __classPrivateFieldGet(this, _Assets_jsons, "f").set(jsonUrl, jsonAsset);
    }
    getImageAsset(imageUrl) {
        const imageAsset = __classPrivateFieldGet(this, _Assets_images, "f").get(imageUrl);
        if (!imageAsset) {
            throw Error(`Assets: There is no image loaded for: ${imageUrl}`);
        }
        return imageAsset;
    }
    getFontAsset(fontId) {
        var _a;
        const { font, imageTextColor, imageBgColor } = (_a = __classPrivateFieldGet(this, _Assets_fonts, "f").get(fontId)) !== null && _a !== void 0 ? _a : BpxUtils.throwError(`Assets: font descriptor is missing for font ID "${fontId}"`);
        return {
            font,
            image: font.imageUrl ? this.getImageAsset(font.imageUrl) : null,
            imageTextColor,
            imageBgColor,
        };
    }
    getSoundAsset(soundUrl) {
        const soundAsset = __classPrivateFieldGet(this, _Assets_sounds, "f").get(soundUrl);
        if (!soundAsset) {
            throw Error(`Assets: There is no sound loaded for: ${soundUrl}`);
        }
        return soundAsset;
    }
    getJsonAsset(jsonUrl) {
        const jsonAsset = __classPrivateFieldGet(this, _Assets_jsons, "f").get(jsonUrl);
        if (!jsonAsset) {
            throw Error(`Assets: There is no JSON loaded for: ${jsonUrl}`);
        }
        return jsonAsset;
    }
}
_Assets_images = new WeakMap(), _Assets_fonts = new WeakMap(), _Assets_sounds = new WeakMap(), _Assets_jsons = new WeakMap();
