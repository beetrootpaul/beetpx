import { b_ } from "../../../src";

export class Music {
  static assetUrls = ["music_base.flac", "music_melody.flac"];

  static beatFrames = 32;

  constructor() {
    b_.startPlaybackLooped("music_base.flac", {
      onGamePause: "ignore",
    });
    b_.startPlaybackLooped("music_melody.flac", {
      onGamePause: "mute",
    });
  }
}
