import { b_ } from "../../../src";

export class Music {
  static assetUrls = ["music_base.flac", "music_melody.flac"];

  static beatFrames = 32;

  // TODO: ???
  #melodyPlaybackId?: number;
  // TODO: REMOVE
  #tmpBaseId?: number;

  start(): void {
    // TODO: do NOT pause/resume
    this.#tmpBaseId = b_.startPlaybackLooped("music_base.flac");
    // TODO: pause/resume
    // TODO: REMOVE
    // this.#melodyPlaybackId = b_.startPlayback("music_melody.flac");
    this.#melodyPlaybackId = b_.startPlaybackLooped("music_melody.flac");
    // TODO: REMOVE
    // this.#melodyPlaybackId = b_.startPlaybackSequence({
    // intro: [
    //   [
    //     {
    //       url: "music_base.flac",
    //       durationMs: (fullSoundDurationMs) => (fullSoundDurationMs / 8) * 5,
    //     },
    //   ],
    // ],
    // loop: [
    //   [
    //     {
    //       url: "music_melody.flac",
    //       durationMs: (fullSoundDurationMs) => (fullSoundDurationMs / 16) * 5,
    //     },
    //   ],
    // ],
    // });
    // TODO: ^^^ introduce something like `onGamePage: "stop"
  }

  update(): void {
    // TODO: REMOVE
    if (b_.wasButtonJustPressed("up")) {
      b_.resumePlayback(this.#melodyPlaybackId!);
      b_.resumePlayback(this.#tmpBaseId!);
    }
    // TODO: REMOVE
    if (b_.wasButtonJustPressed("down")) {
      b_.pausePlayback(this.#melodyPlaybackId!);
      b_.pausePlayback(this.#tmpBaseId!);
    }
    // TODO: REMOVE
    if (b_.wasButtonJustPressed("left")) {
      b_.mutePlayback(this.#melodyPlaybackId!, { fadeOutMillis: 500 });
      b_.mutePlayback(this.#tmpBaseId!, { fadeOutMillis: 500 });
    }
    // TODO: REMOVE
    if (b_.wasButtonJustPressed("right")) {
      b_.unmutePlayback(this.#melodyPlaybackId!, { fadeInMillis: 500 });
      b_.unmutePlayback(this.#tmpBaseId!, { fadeInMillis: 500 });
    }
  }
}
