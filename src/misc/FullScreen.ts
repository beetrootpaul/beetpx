import { HtmlTemplate } from "../HtmlTemplate";
import { Logger } from "../logger/Logger";

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
  // noinspection PointlessBooleanExpressionJS
  static readonly #isFullScreenSupported: boolean = !!(
    document.fullscreenEnabled || document.webkitFullscreenEnabled
  );

  isFullScreenSupported(): boolean {
    return FullScreen.#isFullScreenSupported;
  }

  abstract isInFullScreen(): boolean;

  static create(): FullScreen {
    return FullScreen.#isFullScreenSupported
      ? new FullScreenSupported()
      : new FullScreenNoop();
  }

  abstract toggleFullScreen(): void;
}

class FullScreenNoop extends FullScreen {
  constructor() {
    super();

    document
      .querySelectorAll<HTMLElement>(HtmlTemplate.selectors.controlsFullScreen)
      .forEach((button) => {
        button.style.display = "none";
      });
  }

  isInFullScreen(): boolean {
    return false;
  }

  toggleFullScreen(): void {}
}

// noinspection SuspiciousTypeOfGuard
class FullScreenSupported extends FullScreen {
  readonly #fullScreenSubject: Element;

  readonly #nativeRequestFullscreen: () => void | Promise<void>;
  readonly #nativeExitFullscreen: () => void | Promise<void>;

  constructor() {
    super();

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

  isInFullScreen(): boolean {
    return !!(document.fullscreenElement || document.webkitFullscreenElement);
  }

  toggleFullScreen(): void {
    if (this.isInFullScreen()) {
      this.#fullScreenOff();
    } else {
      this.#fullScreenOn();
    }
  }

  #fullScreenOn(): void {
    const result = this.#nativeRequestFullscreen();
    if (typeof result === "object") {
      result.catch((err) => {
        Logger.errorBeetPx(err);
      });
    }
  }

  #fullScreenOff(): void {
    const result = this.#nativeExitFullscreen();
    if (typeof result === "object") {
      result.catch((err) => {
        Logger.errorBeetPx(err);
      });
    }
  }
}
