import { HtmlTemplate } from "../HtmlTemplate";
import { Logger } from "../logger/Logger";
import { throwError } from "../utils/throwError";
export class FullScreen {
    static #isFullScreenSupported = !!(typeof document ===
        "undefined"
        ? false
        : document.fullscreenEnabled || document.webkitFullscreenEnabled);
    isFullScreenSupported() {
        return FullScreen.#isFullScreenSupported;
    }
    static create() {
        return FullScreen.#isFullScreenSupported
            ? new FullScreenSupported()
            : new FullScreenNoop();
    }
}
class FullScreenNoop extends FullScreen {
    constructor() {
        super();
        document
            .querySelectorAll(HtmlTemplate.selectors.controlsFullScreen)
            .forEach(button => {
            button.style.display = "none";
        });
    }
    isInFullScreen() {
        return false;
    }
    toggleFullScreen() { }
}
class FullScreenSupported extends FullScreen {
    #fullScreenSubject;
    #nativeRequestFullscreen;
    #nativeExitFullscreen;
    constructor() {
        super();
        const fullScreenSubject = document.querySelector(HtmlTemplate.selectors.fullScreenSubject) ??
            throwError(`Was unable to find a full screen subject by selector '${HtmlTemplate.selectors.fullScreenSubject}'`);
        this.#fullScreenSubject = fullScreenSubject;
        const nativeRequestFullscreen = this.#fullScreenSubject.requestFullscreen ??
            this.#fullScreenSubject.webkitRequestFullscreen ??
            (() => { });
        this.#nativeRequestFullscreen = nativeRequestFullscreen.bind(this.#fullScreenSubject);
        const nativeExitFullscreen = document.exitFullscreen ?? document.webkitExitFullscreen ?? (() => { });
        this.#nativeExitFullscreen = nativeExitFullscreen.bind(document);
    }
    isInFullScreen() {
        return !!(document.fullscreenElement || document.webkitFullscreenElement);
    }
    toggleFullScreen() {
        if (this.isInFullScreen()) {
            this.#fullScreenOff();
        }
        else {
            this.#fullScreenOn();
        }
    }
    #fullScreenOn() {
        const result = this.#nativeRequestFullscreen();
        if (typeof result === "object") {
            result.catch(err => {
                Logger.errorBeetPx(err);
            });
        }
    }
    #fullScreenOff() {
        const result = this.#nativeExitFullscreen();
        if (typeof result === "object") {
            result.catch(err => {
                Logger.errorBeetPx(err);
            });
        }
    }
}
//# sourceMappingURL=FullScreen.js.map