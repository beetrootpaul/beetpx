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
var _AssetLoader_instances, _AssetLoader_assets, _AssetLoader_decodeAudioData, _AssetLoader_loadImage, _AssetLoader_loadSound, _AssetLoader_loadJson, _AssetLoader_is2xx;
import { decode as fastPngDecode } from "fast-png";
export class AssetLoader {
    constructor(assets, params) {
        _AssetLoader_instances.add(this);
        _AssetLoader_assets.set(this, void 0);
        _AssetLoader_decodeAudioData.set(this, void 0);
        __classPrivateFieldSet(this, _AssetLoader_assets, assets, "f");
        __classPrivateFieldSet(this, _AssetLoader_decodeAudioData, params.decodeAudioData, "f");
    }
    loadAssets(assetsToLoad) {
        return __awaiter(this, void 0, void 0, function* () {
            assetsToLoad.fonts.forEach(({ font, imageTextColor, imageBgColor }) => {
                __classPrivateFieldGet(this, _AssetLoader_assets, "f").addFontAsset(font.id, {
                    font,
                    imageTextColor,
                    imageBgColor,
                });
            });
            const uniqueImageUrls = new Set([
                ...assetsToLoad.images.map(({ url }) => url),
                ...assetsToLoad.fonts.map(({ font }) => font.imageUrl),
            ]);
            yield Promise.all([
                ...Array.from(uniqueImageUrls).map((url) => __classPrivateFieldGet(this, _AssetLoader_instances, "m", _AssetLoader_loadImage).call(this, url)),
                ...assetsToLoad.sounds.map(({ url }) => __awaiter(this, void 0, void 0, function* () { return __classPrivateFieldGet(this, _AssetLoader_instances, "m", _AssetLoader_loadSound).call(this, url); })),
                ...assetsToLoad.jsons.map(({ url }) => __awaiter(this, void 0, void 0, function* () { return __classPrivateFieldGet(this, _AssetLoader_instances, "m", _AssetLoader_loadJson).call(this, url); })),
            ]);
        });
    }
}
_AssetLoader_assets = new WeakMap(), _AssetLoader_decodeAudioData = new WeakMap(), _AssetLoader_instances = new WeakSet(), _AssetLoader_loadImage = function _AssetLoader_loadImage(url) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!url.toLowerCase().endsWith(".png")) {
            throw Error(`Assets: only PNG image files are supported. The file which doesn't seem to be PNG: "${url}"`);
        }
        const httpResponse = yield fetch(url);
        if (!__classPrivateFieldGet(this, _AssetLoader_instances, "m", _AssetLoader_is2xx).call(this, httpResponse.status)) {
            throw Error(`Assets: could not fetch PNG file: "${url}"`);
        }
        const arrayBuffer = yield httpResponse.arrayBuffer();
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        const decodedPng = fastPngDecode(arrayBuffer);
        if (decodedPng.channels !== 3 && decodedPng.channels !== 4) {
            throw Error(`Assets: only PNG image files with 3 or 4 channels are supported. The file which seems to have ${decodedPng.channels} channels instead: "${url}"`);
        }
        __classPrivateFieldGet(this, _AssetLoader_assets, "f").addImageAsset(url, {
            width: decodedPng.width,
            height: decodedPng.height,
            channels: decodedPng.channels,
            rgba8bitData: decodedPng.data,
        });
    });
}, _AssetLoader_loadSound = function _AssetLoader_loadSound(url) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!url.toLowerCase().endsWith(".wav") &&
            !url.toLowerCase().endsWith(".flac")) {
            throw Error(`Assets: only wav and flac sound files are supported due to Safari compatibility. The file which doesn't seem to be neither wav nor flac: "${url}"`);
        }
        const httpResponse = yield fetch(url);
        if (!__classPrivateFieldGet(this, _AssetLoader_instances, "m", _AssetLoader_is2xx).call(this, httpResponse.status)) {
            throw Error(`Assets: could not fetch sound file: "${url}"`);
        }
        const arrayBuffer = yield httpResponse.arrayBuffer();
        const audioBuffer = yield __classPrivateFieldGet(this, _AssetLoader_decodeAudioData, "f").call(this, arrayBuffer);
        __classPrivateFieldGet(this, _AssetLoader_assets, "f").addSoundAsset(url, { audioBuffer });
    });
}, _AssetLoader_loadJson = function _AssetLoader_loadJson(url) {
    return __awaiter(this, void 0, void 0, function* () {
        const httpResponse = yield fetch(url);
        if (!__classPrivateFieldGet(this, _AssetLoader_instances, "m", _AssetLoader_is2xx).call(this, httpResponse.status)) {
            throw Error(`Assets: could not fetch JSON file: "${url}"`);
        }
        const json = yield httpResponse.json();
        __classPrivateFieldGet(this, _AssetLoader_assets, "f").addJsonAsset(url, { json });
    });
}, _AssetLoader_is2xx = function _AssetLoader_is2xx(httpStatus) {
    return httpStatus >= 200 && httpStatus < 300;
};
