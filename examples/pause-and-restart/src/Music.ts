import { b_ } from "../../../src";

export class Music {
  static assetUrls = ["music_base.flac", "music_melody.flac"];

  static beatFrames = 32;

  // TODO: ???
  #melodyPlaybackId?: number;

  start(): void {
    // TODO: do NOT pause/resume
    b_.startPlaybackLooped("music_base.flac");
    // TODO: pause/resume
    this.#melodyPlaybackId = b_.startPlaybackLooped("music_melody.flac");
    // TODO: ^^^ introduce something like `onGamePage: "stop"
  }
}
