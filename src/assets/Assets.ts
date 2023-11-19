import { type PngDataArray } from "fast-png";
import { BpxUtils } from "../Utils";
import { BpxRgbColor } from "../color/RgbColor";
import { BpxFont, BpxFontId } from "../font/Font";

export type BpxImageUrl = string;
export type BpxSoundUrl = string;
export type BpxJsonUrl = string;

export type ImageAsset = {
  width: number;
  height: number;
  channels: 3 | 4;
  rgba8bitData: PngDataArray;
};

export type FontAsset = {
  font: BpxFont;
  image: ImageAsset | null;
  spriteTextColor: BpxRgbColor | null;
};

export type SoundAsset = {
  audioBuffer: AudioBuffer;
};

export type JsonAsset = {
  json: any;
};

export class Assets {
  #images: Map<BpxImageUrl, ImageAsset> = new Map();
  #fonts: Map<
    BpxFontId,
    {
      font: BpxFont;
      spriteTextColor: BpxRgbColor | null;
    }
  > = new Map();
  #sounds: Map<BpxSoundUrl, SoundAsset> = new Map();
  #jsons: Map<BpxJsonUrl, JsonAsset> = new Map();

  addImageAsset(imageUrl: BpxImageUrl, imageAsset: ImageAsset): void {
    this.#images.set(imageUrl, imageAsset);
  }

  addFontAsset(
    fontId: BpxFontId,
    fontProps: {
      font: BpxFont;
      spriteTextColor: BpxRgbColor | null;
    },
  ): void {
    this.#fonts.set(fontId, fontProps);
  }

  addSoundAsset(soundUrl: BpxSoundUrl, soundAsset: SoundAsset): void {
    this.#sounds.set(soundUrl, soundAsset);
  }

  addJsonAsset(jsonUrl: BpxJsonUrl, jsonAsset: JsonAsset): void {
    this.#jsons.set(jsonUrl, jsonAsset);
  }

  getImageAsset(imageUrl: BpxImageUrl): ImageAsset {
    const imageAsset = this.#images.get(imageUrl);
    if (!imageAsset) {
      throw Error(`Assets: There is no image loaded for: ${imageUrl}`);
    }
    return imageAsset;
  }

  getFontAsset(fontId: BpxFontId): FontAsset {
    const { font, spriteTextColor } =
      this.#fonts.get(fontId) ??
      BpxUtils.throwError(
        `Assets: font descriptor is missing for font ID "${fontId}"`,
      );
    return {
      font,
      image: font.imageUrl ? this.getImageAsset(font.imageUrl) : null,
      spriteTextColor,
    };
  }

  getSoundAsset(soundUrl: BpxSoundUrl): SoundAsset {
    const soundAsset = this.#sounds.get(soundUrl);
    if (!soundAsset) {
      throw Error(`Assets: There is no sound loaded for: ${soundUrl}`);
    }
    return soundAsset;
  }

  getJsonAsset(jsonUrl: BpxJsonUrl): JsonAsset {
    const jsonAsset = this.#jsons.get(jsonUrl);
    if (!jsonAsset) {
      throw Error(`Assets: There is no JSON loaded for: ${jsonUrl}`);
    }
    return jsonAsset;
  }
}
