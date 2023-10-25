import { Logger } from "../logger/Logger";
import { u_ } from "../Utils";

export class AudioHelpers {
  static muteGain(
    gainNode: GainNode,
    audioContextStartTime: number,
    fadeOutMillis: number,
    onMuted: () => void = u_.noop,
  ): void {
    fadeOutMillis = Math.max(0, fadeOutMillis);

    AudioHelpers.#tryNTimes(15, 100, () => {
      if (fadeOutMillis > 0) {
        gainNode.gain.setValueCurveAtTime(
          [gainNode.gain.value, 0],
          audioContextStartTime / 1000,
          fadeOutMillis / 1000,
        );
      } else {
        gainNode.gain.setValueAtTime(0, audioContextStartTime);
      }
    }).catch(() => {});

    setTimeout(() => {
      onMuted();
    }, fadeOutMillis);
  }

  static unmuteGain(
    gainNode: GainNode,
    audioContextStartTime: number,
    fadeInMillis: number,
    onUnmuted: () => void = u_.noop,
  ): void {
    fadeInMillis = Math.max(0, fadeInMillis);

    AudioHelpers.#tryNTimes(15, 100, () => {
      if (fadeInMillis > 0) {
        gainNode.gain.setValueCurveAtTime(
          [gainNode.gain.value, 1],
          audioContextStartTime / 1000,
          fadeInMillis / 1000,
        );
      } else {
        gainNode.gain.setValueAtTime(1, audioContextStartTime);
      }
    }).catch((err) => {});

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
