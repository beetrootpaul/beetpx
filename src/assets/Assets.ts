import { type PngDataArray } from "fast-png";
import { throwError } from "../utils/throwError";

/**
 * TODO: docs
 */
export type BpxImageUrl = string;
/**
 * TODO: docs
 */
export type BpxSoundUrl = string;
/**
 * TODO: docs
 */
export type BpxJsonUrl = string;

/**
 * TODO: docs
 */
export type BpxImageAsset = {
  /**
   * TODO: docs
   */
  width: number;
  /**
   * TODO: docs
   */
  height: number;
  /**
   * TODO: docs
   */
  channels: 3 | 4;
  /**
   * TODO: docs
   */
  rgba8bitData: PngDataArray;
};

/**
 * TODO: docs
 */
export type BpxSoundAsset = {
  /**
   * TODO: docs
   */
  audioBuffer: AudioBuffer;
};

/**
 * TODO: docs
 */
export type BpxJsonAsset = {
  /**
   * TODO: docs
   */
  json: any;
};

export class Assets {
  #images: Map<BpxImageUrl, BpxImageAsset> = new Map();
  #sounds: Map<BpxSoundUrl, BpxSoundAsset> = new Map();
  #jsons: Map<BpxJsonUrl, BpxJsonAsset> = new Map();

  addImageAsset(imageUrl: BpxImageUrl, imageAsset: BpxImageAsset): void {
    this.#images.set(imageUrl, imageAsset);
  }

  addSoundAsset(soundUrl: BpxSoundUrl, soundAsset: BpxSoundAsset): void {
    this.#sounds.set(soundUrl, soundAsset);
  }

  addJsonAsset(jsonUrl: BpxJsonUrl, jsonAsset: BpxJsonAsset): void {
    this.#jsons.set(jsonUrl, jsonAsset);
  }

  getImageAsset(imageUrl: BpxImageUrl): BpxImageAsset {
    return (
      this.#images.get(imageUrl) ??
      throwError(`Assets: There is no image loaded for: ${imageUrl}`)
    );
  }

  getSoundAsset(soundUrl: BpxSoundUrl): BpxSoundAsset {
    return (
      this.#sounds.get(soundUrl) ??
      throwError(`Assets: There is no sound loaded for: ${soundUrl}`)
    );
  }

  getJsonAsset(jsonUrl: BpxJsonUrl): BpxJsonAsset {
    return (
      this.#jsons.get(jsonUrl) ??
      throwError(`Assets: There is no JSON loaded for: ${jsonUrl}`)
    );
  }
}
