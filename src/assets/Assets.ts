import { type PngDataArray } from "fast-png";
import { BpxUtils } from "../Utils";
import { BpxRgbColor } from "../color/RgbColor";
import { BpxFont, BpxFontId } from "../font/Font";

export type BpxImageUrl = string;
export type BpxSoundUrl = string;
export type BpxJsonUrl = string;

export type BpxImageAsset = {
  width: number;
  height: number;
  channels: 3 | 4;
  rgba8bitData: PngDataArray;
};

export type BpxFontAsset = {
  font: BpxFont;
  image: BpxImageAsset | null;
  spriteTextColor: BpxRgbColor | null;
};

export type BpxSoundAsset = {
  audioBuffer: AudioBuffer;
};

export type BpxJsonAsset = {
  json: any;
};

export class Assets {
  #images: Map<BpxImageUrl, BpxImageAsset> = new Map();
  #fonts: Map<
    BpxFontId,
    {
      font: BpxFont;
      spriteTextColor: BpxRgbColor | null;
    }
  > = new Map();
  #sounds: Map<BpxSoundUrl, BpxSoundAsset> = new Map();
  #jsons: Map<BpxJsonUrl, BpxJsonAsset> = new Map();

  addImageAsset(imageUrl: BpxImageUrl, imageAsset: BpxImageAsset): void {
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

  addSoundAsset(soundUrl: BpxSoundUrl, soundAsset: BpxSoundAsset): void {
    this.#sounds.set(soundUrl, soundAsset);
  }

  addJsonAsset(jsonUrl: BpxJsonUrl, jsonAsset: BpxJsonAsset): void {
    this.#jsons.set(jsonUrl, jsonAsset);
  }

  getImageAsset(imageUrl: BpxImageUrl): BpxImageAsset {
    const imageAsset = this.#images.get(imageUrl);
    if (!imageAsset) {
      throw Error(`Assets: There is no image loaded for: ${imageUrl}`);
    }
    return imageAsset;
  }

  getFontAsset(fontId: BpxFontId): BpxFontAsset {
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

  getSoundAsset(soundUrl: BpxSoundUrl): BpxSoundAsset {
    const soundAsset = this.#sounds.get(soundUrl);
    if (!soundAsset) {
      throw Error(`Assets: There is no sound loaded for: ${soundUrl}`);
    }
    return soundAsset;
  }

  getJsonAsset(jsonUrl: BpxJsonUrl): BpxJsonAsset {
    const jsonAsset = this.#jsons.get(jsonUrl);
    if (!jsonAsset) {
      throw Error(`Assets: There is no JSON loaded for: ${jsonUrl}`);
    }
    return jsonAsset;
  }
}
