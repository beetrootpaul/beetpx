import { HtmlTemplate } from "./HtmlTemplate";
import { Logger } from "./logger/Logger";

declare global {
  // noinspection JSUnusedGlobalSymbols
  interface Document {
    webkitFullscreenEnabled?: boolean;
    webkitFullscreenElement?: () => Element;
    webkitExitFullscreen?: () => void;
  }

  interface Element {
    webkitRequestFullscreen?: () => void;
  }
}

export abstract class FullScreen {
  static create(): FullScreen {
    return document.fullscreenEnabled || document.webkitFullscreenEnabled
      ? new FullScreenSupported()
      : new FullScreenNoop();
  }

  abstract toggle(): void;
}

class FullScreenNoop implements FullScreen {
  constructor() {
    document
      .querySelectorAll<HTMLElement>(HtmlTemplate.selectors.controlsFullScreen)
      .forEach((button) => {
        button.style.display = "none";
      });
  }

  toggle(): void {}
}

// noinspection SuspiciousTypeOfGuard
class FullScreenSupported implements FullScreen {
  readonly #fullScreenSubject: Element;

  readonly #nativeRequestFullscreen: () => void | Promise<void>;
  readonly #nativeExitFullscreen: () => void | Promise<void>;

  constructor() {
    const fullScreenSubject = document.querySelector(
      HtmlTemplate.selectors.fullScreenSubject,
    );
    if (!fullScreenSubject) {
      throw Error(
        `Was unable to find a full screen subject by selector '${HtmlTemplate.selectors.fullScreenSubject}'`,
      );
    }
    this.#fullScreenSubject = fullScreenSubject;

    const nativeRequestFullscreen =
      this.#fullScreenSubject.requestFullscreen ??
      this.#fullScreenSubject.webkitRequestFullscreen ??
      (() => {});
    this.#nativeRequestFullscreen = nativeRequestFullscreen.bind(
      this.#fullScreenSubject,
    );

    const nativeExitFullscreen =
      document.exitFullscreen ?? document.webkitExitFullscreen ?? (() => {});
    this.#nativeExitFullscreen = nativeExitFullscreen.bind(document);
  }

  toggle(): void {
    if (document.fullscreenElement || document.webkitFullscreenElement) {
      this.#fullScreenOff();
    } else {
      this.#fullScreenOn();
    }
  }

  #fullScreenOn(): void {
    const result = this.#nativeRequestFullscreen();
    if (result instanceof Promise) {
      result.catch((err) => {
        Logger.errorBeetPx(err);
      });
    }
  }

  #fullScreenOff(): void {
    const result = this.#nativeExitFullscreen();
    if (result instanceof Promise) {
      result.catch((err) => {
        Logger.errorBeetPx(err);
      });
    }
  }
}
