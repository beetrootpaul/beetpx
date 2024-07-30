import { decode as fastPngDecode } from "fast-png";
import { Logger } from "../logger/Logger";
export class AssetLoader {
    #assets;
    #decodeAudioData;
    constructor(assets, params) {
        this.#assets = assets;
        this.#decodeAudioData = params.decodeAudioData;
    }
    async loadAssets(assetsToLoad) {
        const normalizedAssetsToLoad = assetsToLoad
            .map(url => url.trim())
            .filter(url => url.length > 0);
        const unrecognizedAssetFormats = normalizedAssetsToLoad.filter(url => !this.#isImage(url) && !this.#isSound(url) && !this.#isJson(url));
        if (unrecognizedAssetFormats.length > 0) {
            throw Error("Assets: following URLs don't look like any of supported formats: " +
                unrecognizedAssetFormats.map(url => `"${url}"`).join(", ") +
                '. Supported formats are: ".png", ".wav", ".flac", ".json", ".ldtk"');
        }
        await Promise.all([
            ...normalizedAssetsToLoad
                .filter(url => this.#isImage(url))
                .map(url => this.#loadImage(url)),
            ...normalizedAssetsToLoad
                .filter(url => this.#isSound(url))
                .map(url => this.#loadSound(url)),
            ...normalizedAssetsToLoad
                .filter(url => this.#isJson(url))
                .map(url => this.#loadJson(url)),
        ]);
    }
    #isImage(url) {
        return url.toLowerCase().endsWith(".png");
    }
    #isSound(url) {
        return (url.toLowerCase().endsWith(".wav") || url.toLowerCase().endsWith(".flac"));
    }
    #isJson(url) {
        return (url.toLowerCase().endsWith(".json") || url.toLowerCase().endsWith(".ldtk"));
    }
    async #loadImage(url) {
        Logger.infoBeetPx(`Assets: loading image "${url}"`);
        const httpResponse = await fetch(this.#withPathFixed(url));
        if (!this.#is2xx(httpResponse.status)) {
            throw Error(`Assets: could not fetch PNG file: "${url}"`);
        }
        const arrayBuffer = await httpResponse.arrayBuffer();
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        const decodedPng = fastPngDecode(arrayBuffer);
        if (decodedPng.channels !== 3 && decodedPng.channels !== 4) {
            throw Error(`Assets: only PNG image files with 3 or 4 channels are supported. The file which seems to have ${decodedPng.channels} channels instead: "${url}"`);
        }
        this.#assets.addImageAsset(url, {
            width: decodedPng.width,
            height: decodedPng.height,
            channels: decodedPng.channels,
            rgba8bitData: decodedPng.data,
        });
    }
    async #loadSound(url) {
        Logger.infoBeetPx(`Assets: loading sound "${url}"`);
        const httpResponse = await fetch(this.#withPathFixed(url));
        if (!this.#is2xx(httpResponse.status)) {
            throw Error(`Assets: could not fetch sound file: "${url}"`);
        }
        const arrayBuffer = await httpResponse.arrayBuffer();
        const audioBuffer = await this.#decodeAudioData(arrayBuffer);
        this.#assets.addSoundAsset(url, { audioBuffer });
    }
    async #loadJson(url) {
        Logger.infoBeetPx(`Assets: loading JSON "${url}"`);
        const httpResponse = await fetch(this.#withPathFixed(url));
        if (!this.#is2xx(httpResponse.status)) {
            throw Error(`Assets: could not fetch JSON file: "${url}"`);
        }
        const json = await httpResponse.json();
        this.#assets.addJsonAsset(url, { json });
    }
    #withPathFixed(url) {
        return (url.startsWith("/") ||
            url.startsWith("http:
            url.startsWith("https:
            url
            : `/${url}`;
    }
    #is2xx(httpStatus) {
        return httpStatus >= 200 && httpStatus < 300;
    }
}
