import { BpxSolidColor } from "./Color";
import { BpxFont, BpxFontId } from "./font/Font";
import { BpxUtils } from "./Utils";

export type AssetsToLoad = {
  images: ImageAssetToLoad[];
  fonts: FontAssetToLoad[];
  sounds: SoundAssetToLoad[];
  jsons: JsonAssetToLoad[];
};

export type BpxImageUrl = string;
export type SoundUrl = string;
export type JsonUrl = string;

type ImageAssetToLoad = {
  url: BpxImageUrl;
};

type FontAssetToLoad = {
  font: BpxFont;
  imageTextColor: BpxSolidColor;
  imageBgColor: BpxSolidColor;
};

type SoundAssetToLoad = {
  url: SoundUrl;
};

type JsonAssetToLoad = {
  url: JsonUrl;
};

export type ImageAsset = {
  width: number;
  height: number;
  rgba8bitData: Uint8ClampedArray;
};

export type FontAsset = {
  font: BpxFont;
  image: ImageAsset;
  imageTextColor: BpxSolidColor;
  imageBgColor: BpxSolidColor;
};

export type SoundAsset = {
  audioBuffer: AudioBuffer;
};

export type JsonAsset = {
  json: any;
};

export class Assets {
  readonly #decodeAudioData: (arrayBuffer: ArrayBuffer) => Promise<AudioBuffer>;

  #images: Map<BpxImageUrl, ImageAsset> = new Map();
  #fonts: Map<
    BpxFontId,
    {
      font: BpxFont;
      imageTextColor: BpxSolidColor;
      imageBgColor: BpxSolidColor;
    }
  > = new Map();
  #sounds: Map<SoundUrl, SoundAsset> = new Map();
  #jsons: Map<JsonUrl, JsonAsset> = new Map();

  constructor(params: {
    decodeAudioData: (arrayBuffer: ArrayBuffer) => Promise<AudioBuffer>;
  }) {
    this.#decodeAudioData = params.decodeAudioData;
  }

  // TODO: game loading screen during assets loading?
  async loadAssets(assetsToLoad: AssetsToLoad): Promise<void> {
    assetsToLoad.fonts.forEach(({ font, imageTextColor, imageBgColor }) => {
      this.#fonts.set(font.id, { font, imageTextColor, imageBgColor });
    });

    const uniqueImageUrls = new Set([
      ...assetsToLoad.images.map(({ url }) => url),
      ...assetsToLoad.fonts.map(({ font }) => font.imageUrl),
    ]);
    await Promise.all(
      Array.from(uniqueImageUrls).map(async (url) => {
        const htmlImage = new Image();
        htmlImage.src = url;
        await htmlImage.decode();
        const canvas = document.createElement("canvas");
        canvas.width = htmlImage.naturalWidth;
        canvas.height = htmlImage.naturalHeight;
        const ctx = canvas.getContext("2d", {
          // https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas#turn_off_transparency
          alpha: false,
        });
        if (!ctx) {
          throw Error(`Assets: Failed to process the image: ${htmlImage.src}`);
        }
        ctx.drawImage(htmlImage, 0, 0);
        const imageData: ImageData = ctx.getImageData(
          0,
          0,
          canvas.width,
          canvas.height,
        );
        this.#images.set(url, {
          width: imageData.width,
          height: imageData.height,
          rgba8bitData: imageData.data,
        });
      }),
    );

    // TODO: make sounds loaded in parallel with images above
    await Promise.all(
      assetsToLoad.sounds.map(async ({ url }) => {
        if (
          !url.toLowerCase().endsWith(".wav") &&
          !url.toLowerCase().endsWith(".flac")
        ) {
          throw Error(
            `Assets: only wav and flac sound files are supported due to Safari compatibility. The file which doesn't seem to be neither wav nor flac: "${url}"`,
          );
        }
        const httpResponse = await fetch(url);
        if (!this.#is2xx(httpResponse.status)) {
          throw Error(`Assets: could not fetch sound file: "${url}"`);
        }
        const arrayBuffer = await httpResponse.arrayBuffer();
        const audioBuffer = await this.#decodeAudioData(arrayBuffer);
        this.#sounds.set(url, { audioBuffer });
      }),
    );

    await Promise.all(
      assetsToLoad.jsons.map(async ({ url }) => {
        const httpResponse = await fetch(url);
        if (!this.#is2xx(httpResponse.status)) {
          throw Error(`Assets: could not fetch JSON file: "${url}"`);
        }
        const json = await httpResponse.json();
        this.#jsons.set(url, { json });
      }),
    );
  }

  // call `loadAssets` before this one
  getImageAsset(urlOfAlreadyLoadedImage: BpxImageUrl): ImageAsset {
    const imageAsset = this.#images.get(urlOfAlreadyLoadedImage);
    if (!imageAsset) {
      throw Error(
        `Assets: There is no image loaded for: ${urlOfAlreadyLoadedImage}`,
      );
    }
    return imageAsset;
  }

  // call `loadAssets` before this one
  getFontAsset(fontId: BpxFontId): FontAsset {
    const { font, imageTextColor, imageBgColor } =
      this.#fonts.get(fontId) ??
      BpxUtils.throwError(
        `Assets: font descriptor is missing for font ID "${fontId}"`,
      );
    return {
      font,
      image: this.getImageAsset(font.imageUrl),
      imageTextColor,
      imageBgColor,
    };
  }

  // call `loadAssets` before this one
  getSoundAsset(urlOfAlreadyLoadedSound: SoundUrl): SoundAsset {
    const soundAsset = this.#sounds.get(urlOfAlreadyLoadedSound);
    if (!soundAsset) {
      throw Error(
        `Assets: There is no sound loaded for: ${urlOfAlreadyLoadedSound}`,
      );
    }
    return soundAsset;
  }

  // call `loadAssets` before this one
  getJsonAsset(urlOfAlreadyLoadedJson: JsonUrl): JsonAsset {
    const jsonAsset = this.#jsons.get(urlOfAlreadyLoadedJson);
    if (!jsonAsset) {
      throw Error(
        `Assets: There is no JSON loaded for: ${urlOfAlreadyLoadedJson}`,
      );
    }
    return jsonAsset;
  }

  #is2xx(httpStatus: number): boolean {
    return httpStatus >= 200 && httpStatus < 300;
  }
}
