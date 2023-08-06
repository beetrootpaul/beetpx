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
var _Assets_decodeAudioData, _Assets_images, _Assets_fonts, _Assets_sounds;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Assets = void 0;
const Utils_1 = require("./Utils");
class Assets {
    constructor(params) {
        _Assets_decodeAudioData.set(this, void 0);
        _Assets_images.set(this, new Map());
        _Assets_fonts.set(this, new Map());
        _Assets_sounds.set(this, new Map());
        __classPrivateFieldSet(this, _Assets_decodeAudioData, params.decodeAudioData, "f");
    }
    // TODO: game loading screen during assets loading?
    async loadAssets(assetsToLoad) {
        assetsToLoad.fonts.forEach(({ url, font, imageTextColor, imageBgColor }) => {
            __classPrivateFieldGet(this, _Assets_fonts, "f").set(url, { font, imageTextColor, imageBgColor });
        });
        const uniqueImageUrls = new Set([
            ...assetsToLoad.images.map(({ url }) => url),
            ...assetsToLoad.fonts.map(({ url }) => url),
        ]);
        await Promise.all(Array.from(uniqueImageUrls).map(async (url) => {
            const htmlImage = new Image();
            htmlImage.src = url;
            await htmlImage.decode();
            const canvas = document.createElement("canvas");
            canvas.width = htmlImage.naturalWidth;
            canvas.height = htmlImage.naturalHeight;
            const ctx = canvas.getContext("2d");
            if (!ctx) {
                throw Error(`Failed to process the image: ${htmlImage.src}`);
            }
            ctx.drawImage(htmlImage, 0, 0);
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            __classPrivateFieldGet(this, _Assets_images, "f").set(url, {
                width: imageData.width,
                height: imageData.height,
                rgba8bitData: imageData.data,
            });
        }));
        // TODO: make sounds loaded in parallel with images above
        await Promise.all(assetsToLoad.sounds.map(async ({ url }) => {
            if (!url.toLowerCase().endsWith(".wav")) {
                throw Error(`Assets: only wav sound files are supported due to Safari compatibility. The file which doesn't seem to be wav: "${url}"`);
            }
            const httpResponse = await fetch(url);
            const arrayBuffer = await httpResponse.arrayBuffer();
            const audioBuffer = await __classPrivateFieldGet(this, _Assets_decodeAudioData, "f").call(this, arrayBuffer);
            __classPrivateFieldGet(this, _Assets_sounds, "f").set(url, {
                audioBuffer,
            });
        }));
    }
    // call `loadAssets` before this one
    getImage(urlOfAlreadyLoadedImage) {
        const imageAsset = __classPrivateFieldGet(this, _Assets_images, "f").get(urlOfAlreadyLoadedImage);
        if (!imageAsset) {
            throw Error(`Assets: There is no image loaded for: ${urlOfAlreadyLoadedImage}`);
        }
        return imageAsset;
    }
    // call `loadAssets` before this one
    getFont(urlOfAlreadyLoadedFontImage) {
        const { font, imageTextColor, imageBgColor } = __classPrivateFieldGet(this, _Assets_fonts, "f").get(urlOfAlreadyLoadedFontImage) ??
            Utils_1.Utils.throwError(`Assets: font descriptor is missing for font image URL "${urlOfAlreadyLoadedFontImage}"`);
        return {
            font,
            image: this.getImage(urlOfAlreadyLoadedFontImage),
            imageTextColor,
            imageBgColor,
        };
    }
    // call `loadAssets` before this one
    getSound(urlOfAlreadyLoadedSound) {
        const soundAsset = __classPrivateFieldGet(this, _Assets_sounds, "f").get(urlOfAlreadyLoadedSound);
        if (!soundAsset) {
            throw Error(`Assets: There is no sound loaded for: ${urlOfAlreadyLoadedSound}`);
        }
        return soundAsset;
    }
}
exports.Assets = Assets;
_Assets_decodeAudioData = new WeakMap(), _Assets_images = new WeakMap(), _Assets_fonts = new WeakMap(), _Assets_sounds = new WeakMap();
