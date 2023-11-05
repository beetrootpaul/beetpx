import {
  decode as fastPngDecode,
  type DecodedPng,
  type PngDataArray,
} from "fast-png";
import { BpxSolidColor } from "./Color";
import { BpxUtils } from "./Utils";
import { BpxFont, BpxFontId } from "./font/Font";

export type AssetsToLoad = {
  images: ImageAssetToLoad[];
  fonts: FontAssetToLoad[];
  sounds: SoundAssetToLoad[];
  jsons: JsonAssetToLoad[];
};

export type BpxImageUrl = string;
export type BpxSoundUrl = string;
export type BpxJsonUrl = string;

type ImageAssetToLoad = {
  url: BpxImageUrl;
};

type FontAssetToLoad = {
  font: BpxFont;
  imageTextColor: BpxSolidColor;
  imageBgColor: BpxSolidColor;
};

type SoundAssetToLoad = {
  url: BpxSoundUrl;
};

type JsonAssetToLoad = {
  url: BpxJsonUrl;
};

export type ImageAsset = {
  width: number;
  height: number;
  channels: 3 | 4;
  rgba8bitData: PngDataArray;
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
  #sounds: Map<BpxSoundUrl, SoundAsset> = new Map();
  #jsons: Map<BpxJsonUrl, JsonAsset> = new Map();

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

    await Promise.all([
      ...Array.from(uniqueImageUrls).map((url) => this.#loadImage(url)),
      ...assetsToLoad.sounds.map(async ({ url }) => this.#loadSound(url)),
      ...assetsToLoad.jsons.map(async ({ url }) => this.#loadJson(url)),
    ]);
  }

  /** NOTE: call `loadAssets` before this one */
  getImageAsset(urlOfAlreadyLoadedImage: BpxImageUrl): ImageAsset {
    const imageAsset = this.#images.get(urlOfAlreadyLoadedImage);
    if (!imageAsset) {
      throw Error(
        `Assets: There is no image loaded for: ${urlOfAlreadyLoadedImage}`,
      );
    }
    return imageAsset;
  }

  /** NOTE: call `loadAssets` before this one */
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

  /** NOTE: call `loadAssets` before this one */
  getSoundAsset(urlOfAlreadyLoadedSound: BpxSoundUrl): SoundAsset {
    const soundAsset = this.#sounds.get(urlOfAlreadyLoadedSound);
    if (!soundAsset) {
      throw Error(
        `Assets: There is no sound loaded for: ${urlOfAlreadyLoadedSound}`,
      );
    }
    return soundAsset;
  }

  /** NOTE: call `loadAssets` before this one */
  getJsonAsset(urlOfAlreadyLoadedJson: BpxJsonUrl): JsonAsset {
    const jsonAsset = this.#jsons.get(urlOfAlreadyLoadedJson);
    if (!jsonAsset) {
      throw Error(
        `Assets: There is no JSON loaded for: ${urlOfAlreadyLoadedJson}`,
      );
    }
    return jsonAsset;
  }

  async #loadImage(url: BpxImageUrl): Promise<void> {
    if (!url.toLowerCase().endsWith(".png")) {
      throw Error(
        `Assets: only PNG image files are supported. The file which doesn't seem to be PNG: "${url}"`,
      );
    }

    const httpResponse = await fetch(url);
    if (!this.#is2xx(httpResponse.status)) {
      throw Error(`Assets: could not fetch PNG file: "${url}"`);
    }
    const arrayBuffer = await httpResponse.arrayBuffer();

    // You might be surprised why do we use "fast-png" for PNG decoding instead of
    //   a more popular solution of:
    //     ```
    //       const htmlImage = new Image();
    //       htmlImage.src = url;
    //       await htmlImage.decode();
    //       const canvas = document.createElement("canvas");
    //       canvas.width = htmlImage.naturalWidth;
    //       canvas.height = htmlImage.naturalHeight;
    //       const ctx = canvas.getContext("2d")!;
    //       ctx.drawImage(htmlImage, 0, 0);
    //       const imageData: ImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    //       return imageData.data;
    //     ```
    //   This is because such approach was prone to browser's color management features.
    //   In particular, we had a case of Firefox on Window 10 on an old Zenbook laptop, which
    //     was adjusting rendered colors. We were able to overcome it by setting
    //     `gfx.color_management.native_srgb` to `true` on `about:config` page of that
    //     particular browser. But still, it would require users to modify their browser config.
    //  Moreover, you might wonder why is it a problem that some colors are slightly adjusted?
    //    It wouldn't be a problem if not for a sprite color mapping. If we define in BeetPx
    //    that we want to map, let's say, lime background into a transparency, then we
    //    need that lime to be exactly same RGB hex as defined in the color mapping, otherwise
    //    it will not get mapped and display as lime.
    const decodedPng: DecodedPng = fastPngDecode(arrayBuffer);

    if (decodedPng.channels !== 3 && decodedPng.channels !== 4) {
      throw Error(
        `Assets: only PNG image files with 3 or 4 channels are supported. The file which seems to have ${decodedPng.channels} channels instead: "${url}"`,
      );
    }

    this.#images.set(url, {
      width: decodedPng.width,
      height: decodedPng.height,
      channels: decodedPng.channels,
      rgba8bitData: decodedPng.data,
    });
  }

  async #loadSound(url: BpxSoundUrl): Promise<void> {
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
  }

  async #loadJson(url: BpxJsonUrl): Promise<void> {
    const httpResponse = await fetch(url);
    if (!this.#is2xx(httpResponse.status)) {
      throw Error(`Assets: could not fetch JSON file: "${url}"`);
    }
    const json = await httpResponse.json();
    this.#jsons.set(url, { json });
  }

  #is2xx(httpStatus: number): boolean {
    return httpStatus >= 200 && httpStatus < 300;
  }
}
