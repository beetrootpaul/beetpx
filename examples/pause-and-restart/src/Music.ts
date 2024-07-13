import { b_ } from "../../../src";

export class Music {
  static assetUrls = ["music_base.flac", "music_melody.flac"];

  static beatFrames = 32;

  // TODO: ???
  #melodyPlaybackId?: number;

  start(): void {
    b_.startPlaybackLooped("music_base.flac", {
      onGamePause: "ignore",
    });
    // TODO: REMOVE
    this.#melodyPlaybackId = b_.startPlaybackLooped("music_melody.flac", {
      onGamePause: "mute",
    });
  }

  update(): void {
    // TODO: REMOVE
    if (b_.wasButtonJustPressed("up")) {
      b_.resumePlayback(this.#melodyPlaybackId!);
    }
    // TODO: REMOVE
    if (b_.wasButtonJustPressed("down")) {
      b_.pausePlayback(this.#melodyPlaybackId!);
    }
    // TODO: REMOVE
    if (b_.wasButtonJustPressed("left")) {
      b_.mutePlayback(this.#melodyPlaybackId!, { fadeOutMillis: 500 });
    }
    // TODO: REMOVE
    if (b_.wasButtonJustPressed("right")) {
      b_.unmutePlayback(this.#melodyPlaybackId!, { fadeInMillis: 500 });
    }
    // TODO: REMOVE
    if (b_.wasButtonJustPressed("b")) {
      b_.stopPlayback(this.#melodyPlaybackId!);
    }
  }
}
