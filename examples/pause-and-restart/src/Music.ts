import { b_ } from "../../../src";

export class Music {
  static assetUrls = ["music_base.flac", "music_melody.flac"];

  static beatFrames = 32;

  #melodyPlaybackId?: number;

  start() {
    b_.startPlaybackLooped("music_base.flac");
    this.#melodyPlaybackId = b_.startPlaybackLooped("music_melody.flac");
  }

  muteMelody() {
    if (this.#melodyPlaybackId) {
      b_.mutePlayback(this.#melodyPlaybackId);
    }
  }

  unmuteMelody() {
    if (this.#melodyPlaybackId) {
      b_.unmutePlayback(this.#melodyPlaybackId);
    }
  }
}
