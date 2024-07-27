import { $ } from "../../src";

export class Music {
  static assetUrls = ["music_base.flac", "music_melody.flac"];

  static beatFrames = 32;

  constructor() {
    $.startPlaybackLooped("music_base.flac", {
      onGamePause: "ignore",
    });
    $.startPlaybackLooped("music_melody.flac", {
      onGamePause: "mute",
    });
  }
}
