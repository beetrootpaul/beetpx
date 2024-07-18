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
var _AssetLoader_instances, _AssetLoader_assets, _AssetLoader_decodeAudioData, _AssetLoader_isImage, _AssetLoader_isSound, _AssetLoader_isJson, _AssetLoader_loadImage, _AssetLoader_loadSound, _AssetLoader_loadJson, _AssetLoader_is2xx;
import { decode as fastPngDecode } from "fast-png";
import { Logger } from "../logger/Logger";
export class AssetLoader {
    constructor(assets, params) {
        _AssetLoader_instances.add(this);
        _AssetLoader_assets.set(this, void 0);
        _AssetLoader_decodeAudioData.set(this, void 0);
        __classPrivateFieldSet(this, _AssetLoader_assets, assets, "f");
        __classPrivateFieldSet(this, _AssetLoader_decodeAudioData, params.decodeAudioData, "f");
    }
    async loadAssets(assetsToLoad) {
        const normalizedAssetsToLoad = assetsToLoad
            .map(url => url.trim())
            .filter(url => url.length > 0);
        const unrecognizedAssetFormats = normalizedAssetsToLoad.filter(url => !__classPrivateFieldGet(this, _AssetLoader_instances, "m", _AssetLoader_isImage).call(this, url) && !__classPrivateFieldGet(this, _AssetLoader_instances, "m", _AssetLoader_isSound).call(this, url) && !__classPrivateFieldGet(this, _AssetLoader_instances, "m", _AssetLoader_isJson).call(this, url));
        if (unrecognizedAssetFormats.length > 0) {
            throw Error("Assets: following URLs don't look like any of supported formats: " +
                unrecognizedAssetFormats.map(url => `"${url}"`).join(", ") +
                '. Supported formats are: ".png", ".wav", ".flac", ".json", ".ldtk"');
        }
        await Promise.all([
            ...normalizedAssetsToLoad
                .filter(url => __classPrivateFieldGet(this, _AssetLoader_instances, "m", _AssetLoader_isImage).call(this, url))
                .map(url => __classPrivateFieldGet(this, _AssetLoader_instances, "m", _AssetLoader_loadImage).call(this, url)),
            ...normalizedAssetsToLoad
                .filter(url => __classPrivateFieldGet(this, _AssetLoader_instances, "m", _AssetLoader_isSound).call(this, url))
                .map(url => __classPrivateFieldGet(this, _AssetLoader_instances, "m", _AssetLoader_loadSound).call(this, url)),
            ...normalizedAssetsToLoad
                .filter(url => __classPrivateFieldGet(this, _AssetLoader_instances, "m", _AssetLoader_isJson).call(this, url))
                .map(url => __classPrivateFieldGet(this, _AssetLoader_instances, "m", _AssetLoader_loadJson).call(this, url)),
        ]);
    }
}
_AssetLoader_assets = new WeakMap(), _AssetLoader_decodeAudioData = new WeakMap(), _AssetLoader_instances = new WeakSet(), _AssetLoader_isImage = function _AssetLoader_isImage(url) {
    return url.toLowerCase().endsWith(".png");
}, _AssetLoader_isSound = function _AssetLoader_isSound(url) {
    return (url.toLowerCase().endsWith(".wav") || url.toLowerCase().endsWith(".flac"));
}, _AssetLoader_isJson = function _AssetLoader_isJson(url) {
    return (url.toLowerCase().endsWith(".json") || url.toLowerCase().endsWith(".ldtk"));
}, _AssetLoader_loadImage = async function _AssetLoader_loadImage(url) {
    Logger.infoBeetPx(`Assets: loading image "${url}"`);
    const httpResponse = await fetch(url);
    if (!__classPrivateFieldGet(this, _AssetLoader_instances, "m", _AssetLoader_is2xx).call(this, httpResponse.status)) {
        throw Error(`Assets: could not fetch PNG file: "${url}"`);
    }
    const arrayBuffer = await httpResponse.arrayBuffer();
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
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
}, _AssetLoader_loadSound = async function _AssetLoader_loadSound(url) {
    Logger.infoBeetPx(`Assets: loading sound "${url}"`);
    const httpResponse = await fetch(url);
    if (!__classPrivateFieldGet(this, _AssetLoader_instances, "m", _AssetLoader_is2xx).call(this, httpResponse.status)) {
        throw Error(`Assets: could not fetch sound file: "${url}"`);
    }
    const arrayBuffer = await httpResponse.arrayBuffer();
    const audioBuffer = await __classPrivateFieldGet(this, _AssetLoader_decodeAudioData, "f").call(this, arrayBuffer);
    __classPrivateFieldGet(this, _AssetLoader_assets, "f").addSoundAsset(url, { audioBuffer });
}, _AssetLoader_loadJson = async function _AssetLoader_loadJson(url) {
    Logger.infoBeetPx(`Assets: loading JSON "${url}"`);
    const httpResponse = await fetch(url);
    if (!__classPrivateFieldGet(this, _AssetLoader_instances, "m", _AssetLoader_is2xx).call(this, httpResponse.status)) {
        throw Error(`Assets: could not fetch JSON file: "${url}"`);
    }
    const json = await httpResponse.json();
    __classPrivateFieldGet(this, _AssetLoader_assets, "f").addJsonAsset(url, { json });
}, _AssetLoader_is2xx = function _AssetLoader_is2xx(httpStatus) {
    return httpStatus >= 200 && httpStatus < 300;
};
