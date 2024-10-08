import { Logger } from "../logger/Logger";
import { noop } from "../utils/noop";

export class AudioHelpers {
  static muteGain(
    gainNode: GainNode,
    audioContextCurrentTime: number,
    fadeOutMillis: number,
    onMuted: () => void = noop,
  ): void {
    fadeOutMillis = Math.max(0, fadeOutMillis);
    Logger.debugBeetPx(
      `AudioHelpers.muteGain (audioContextCurrentTime: ${audioContextCurrentTime}, fadeOutMillis: ${fadeOutMillis})`,
    );

    AudioHelpers.#tryNTimes(15, 100, () => {
      if (fadeOutMillis > 0) {
        gainNode.gain.setValueCurveAtTime(
          [gainNode.gain.value, 0],
          audioContextCurrentTime,
          fadeOutMillis / 1000,
        );
      } else {
        gainNode.gain.setValueAtTime(0, audioContextCurrentTime);
      }
    }).catch(() => {});

    setTimeout(() => {
      onMuted();
    }, fadeOutMillis);
  }

  static unmuteGain(
    gainNode: GainNode,
    audioContextCurrentTime: number,
    fadeInMillis: number,
    onUnmuted: () => void = noop,
  ): void {
    fadeInMillis = Math.max(0, fadeInMillis);
    Logger.debugBeetPx(
      `AudioHelpers.unmuteGain (audioContextCurrentTime: ${audioContextCurrentTime}, fadeInMillis: ${fadeInMillis})`,
    );

    AudioHelpers.#tryNTimes(15, 100, () => {
      if (fadeInMillis > 0) {
        gainNode.gain.setValueCurveAtTime(
          [gainNode.gain.value, 1],
          audioContextCurrentTime,
          fadeInMillis / 1000,
        );
      } else {
        gainNode.gain.setValueAtTime(1, audioContextCurrentTime);
      }
    }).catch(_err => {});

    setTimeout(() => {
      onUnmuted();
    }, fadeInMillis);
  }

  static async #tryNTimes(
    n: number,
    millisBetweenTrials: number,
    action: () => void,
  ): Promise<void> {
    if (n <= 0) {
      Logger.warnBeetPx(
        `AudioHelpers.#tryNTimes: Failed to perform the action in N trials.`,
      );
      return Promise.reject();
    }
    try {
      action();
    } catch (err) {
      Logger.debugBeetPx(`AudioHelpers.#tryNTimes: err:`, err);
      return new Promise((resolve, reject) => {
        Logger.debugBeetPx(
          `AudioHelpers.#tryNTimes: Failed to perform the action, trying ${n} more times…`,
        );
        setTimeout(() => {
          this.#tryNTimes(n - 1, millisBetweenTrials, action).then(
            resolve,
            reject,
          );
        }, millisBetweenTrials);
      });
    }
  }
}
