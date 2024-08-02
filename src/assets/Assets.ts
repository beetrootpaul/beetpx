import { type PngDataArray } from "fast-png";
import { throwError } from "../utils/throwError";

/**
 * @see {@link BpxImageAsset}
 *
 * @category Assets
 */
export type BpxImageUrl = string;

/**
 * @see {@link BpxSoundAsset}
 *
 * @category Assets
 */
export type BpxSoundUrl = string;

/**
 * @see {@link BpxJsonAsset}
 *
 * @category Assets
 */
export type BpxJsonUrl = string;

/**
 * @example
 * ```ts
 * const sprite1Url: BpxImageUrl = "spritesheet.png"; // refers to `./public/spritesheet.png`
 * const sprite2Url: BpxImageUrl = "https://the.url/of/another-spritesheet.png";
 *
 * let sprite1: BpxSprite;
 * let sprite2: BpxSprite;
 *
 * $.setOnStarted(() => {
 *   sprite1 = $spr(sprite1Url)(8,8,0,0);
 *   sprite2 = $spr(sprite2Url)(8,8,0,0);
 * });
 *
 * $.start({
 *   // ...,
 *  assets: [
 *    sprite1Url,
 *    sprite2Url,
 *  ],
 * });
 * ```
 *
 * @category Assets
 */
export type BpxImageAsset = {
  /**
   * Image's width in pixels.
   */
  width: number;
  /**
   * Image's height in pixels.
   */
  height: number;
  /**
   * Number of image channels.
   */
  channels: 3 | 4;
  /**
   * The actual image data.
   */
  rgba8bitData: PngDataArray;
};

/**
 * @example
 * ```ts
 * const musicUrl: BpxSoundUrl = "music.flac"; // refers to `./public/music.flac`
 * const sfxUrl: BpxSoundUrl = "https://the.url/of/sfx.wav";
 *
 * let playback1: BpxAudioPlaybackId;
 * let playback2: BpxAudioPlaybackId;
 *
 * $.setOnStarted(() => {
 *   playback1 = $.startPlayback(musicUrl);
 *   playback2 = $.startPlayback(sfxUrl);
 * });
 *
 * $.start({
 *   // ...,
 *  assets: [
 *    musicUrl,
 *    sfxUrl,
 *  ],
 * });
 * ```
 *
 * @category Assets
 */
export type BpxSoundAsset = {
  /**
   * The actual sound data.
   */
  audioBuffer: AudioBuffer;
};

/**
 * @example
 * ```ts
 * const statsUrl: BpxJsonUrl = "level.ldtk"; // refers to `./public/stats.json`
 * const levelUrl: BpxJsonUrl = "https://the.url/of/level.ldtk";
 *
 * let stats: BpxJsonAsset;
 * let level: BpxJsonAsset;
 *
 * $.setOnStarted(() => {
 *   const stats: BpxJsonAsset = $.getJsonAsset(statsUrl);
 *   const level: BpxJsonAsset = $.getJsonAsset(levelUrl);
 * });
 *
 * $.start({
 *   // ...,
 *  assets: [
 *    statsUrl,
 *    levelUrl,
 *  ],
 * });
 * ```
 *
 * @category Assets
 */
export type BpxJsonAsset = {
  /**
   * A content of the fetched JSON file.
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
