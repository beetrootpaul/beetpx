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
  static newFor(
    fullScreenSubjectSelector: string,
    buttonsSelector: string,
  ): FullScreen {
    return document.fullscreenEnabled || document.webkitFullscreenEnabled
      ? new FullScreenSupported(fullScreenSubjectSelector)
      : new FullScreenNoop(buttonsSelector);
  }

  abstract toggle(): void;
}

class FullScreenNoop implements FullScreen {
  constructor(buttonsSelector: string) {
    document
      .querySelectorAll<HTMLElement>(buttonsSelector)
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

  constructor(fullScreenSubjectSelector: string) {
    const fullScreenSubject = document.querySelector(fullScreenSubjectSelector);
    if (!fullScreenSubject) {
      throw Error(
        `Was unable to find a full screen subject by selector '${fullScreenSubjectSelector}'`,
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
        console.error(err);
      });
    }
  }

  #fullScreenOff(): void {
    const result = this.#nativeExitFullscreen();
    if (result instanceof Promise) {
      result.catch((err) => {
        console.error(err);
      });
    }
  }
}
