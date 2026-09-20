import { $x } from "../../src";

export class Music {
  static assetUrls = ["music_base.flac", "music_melody.flac"];

  static beatFrames = 32;

  constructor() {
    $x.startPlaybackLooped("music_base.flac", {
      onGamePause: "ignore",
    });
    $x.startPlaybackLooped("music_melody.flac", {
      onGamePause: "mute",
    });
  }
}
