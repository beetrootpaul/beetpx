import { SolidColor } from "./Color";
import { Font } from "./font/Font";
export type AssetsToLoad = {
    images: ImageAssetToLoad[];
    fonts: FontAssetToLoad[];
    sounds: SoundAssetToLoad[];
};
export type ImageUrl = string;
export type SoundUrl = string;
type ImageAssetToLoad = {
    url: ImageUrl;
};
type FontAssetToLoad = {
    font: Font;
    url: ImageUrl;
    imageTextColor: SolidColor;
    imageBgColor: SolidColor;
};
type SoundAssetToLoad = {
    url: SoundUrl;
};
export type ImageAsset = {
    width: number;
    height: number;
    rgba8bitData: Uint8ClampedArray;
};
export type FontAsset = {
    font: Font;
    image: ImageAsset;
    imageTextColor: SolidColor;
    imageBgColor: SolidColor;
};
export type SoundAsset = {
    audioBuffer: AudioBuffer;
};
type AssetsParams = {
    decodeAudioData: (arrayBuffer: ArrayBuffer) => Promise<AudioBuffer>;
};
export declare class Assets {
    #private;
    constructor(params: AssetsParams);
    loadAssets(assetsToLoad: AssetsToLoad): Promise<void>;
    getImageAsset(urlOfAlreadyLoadedImage: ImageUrl): ImageAsset;
    getFontAsset(urlOfAlreadyLoadedFontImage: ImageUrl): FontAsset;
    getSoundAsset(urlOfAlreadyLoadedSound: SoundUrl): SoundAsset;
}
export {};
