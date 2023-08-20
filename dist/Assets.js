var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
import { Utils } from "./Utils";
export class Assets {
    constructor(params) {
        _Assets_decodeAudioData.set(this, void 0);
        _Assets_images.set(this, new Map());
        _Assets_fonts.set(this, new Map());
        _Assets_sounds.set(this, new Map());
        __classPrivateFieldSet(this, _Assets_decodeAudioData, params.decodeAudioData, "f");
    }
    // TODO: game loading screen during assets loading?
    loadAssets(assetsToLoad) {
        return __awaiter(this, void 0, void 0, function* () {
            assetsToLoad.fonts.forEach(({ font, imageTextColor, imageBgColor }) => {
                __classPrivateFieldGet(this, _Assets_fonts, "f").set(font.id, { font, imageTextColor, imageBgColor });
            });
            const uniqueImageUrls = new Set([
                ...assetsToLoad.images.map(({ url }) => url),
                ...assetsToLoad.fonts.map(({ font }) => font.imageUrl),
            ]);
            yield Promise.all(Array.from(uniqueImageUrls).map((url) => __awaiter(this, void 0, void 0, function* () {
                const htmlImage = new Image();
                htmlImage.src = url;
                yield htmlImage.decode();
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
            })));
            // TODO: make sounds loaded in parallel with images above
            yield Promise.all(assetsToLoad.sounds.map(({ url }) => __awaiter(this, void 0, void 0, function* () {
                if (!url.toLowerCase().endsWith(".wav")) {
                    throw Error(`Assets: only wav sound files are supported due to Safari compatibility. The file which doesn't seem to be wav: "${url}"`);
                }
                const httpResponse = yield fetch(url);
                const arrayBuffer = yield httpResponse.arrayBuffer();
                const audioBuffer = yield __classPrivateFieldGet(this, _Assets_decodeAudioData, "f").call(this, arrayBuffer);
                __classPrivateFieldGet(this, _Assets_sounds, "f").set(url, {
                    audioBuffer,
                });
            })));
        });
    }
    // call `loadAssets` before this one
    getImageAsset(urlOfAlreadyLoadedImage) {
        const imageAsset = __classPrivateFieldGet(this, _Assets_images, "f").get(urlOfAlreadyLoadedImage);
        if (!imageAsset) {
            throw Error(`Assets: There is no image loaded for: ${urlOfAlreadyLoadedImage}`);
        }
        return imageAsset;
    }
    // call `loadAssets` before this one
    getFontAsset(fontId) {
        var _a;
        const { font, imageTextColor, imageBgColor } = (_a = __classPrivateFieldGet(this, _Assets_fonts, "f").get(fontId)) !== null && _a !== void 0 ? _a : Utils.throwError(`Assets: font descriptor is missing for font ID "${fontId}"`);
        return {
            font,
            image: this.getImageAsset(font.imageUrl),
            imageTextColor,
            imageBgColor,
        };
    }
    // call `loadAssets` before this one
    getSoundAsset(urlOfAlreadyLoadedSound) {
        const soundAsset = __classPrivateFieldGet(this, _Assets_sounds, "f").get(urlOfAlreadyLoadedSound);
        if (!soundAsset) {
            throw Error(`Assets: There is no sound loaded for: ${urlOfAlreadyLoadedSound}`);
        }
        return soundAsset;
    }
}
_Assets_decodeAudioData = new WeakMap(), _Assets_images = new WeakMap(), _Assets_fonts = new WeakMap(), _Assets_sounds = new WeakMap();
