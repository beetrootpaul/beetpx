import { ScreenshotManager, } from "./misc/ScreenshotManager";
export class HtmlTemplate {
    static selectors = {
        fullScreenSubject: "body",
        canvas: "#game_canvas",
        startButton: "#screen_start_game__button",
        controlsLeft: "#dpad_l",
        controlsRight: "#dpad_r",
        controlsUp: "#dpad_u",
        controlsDown: "#dpad_d",
        controlsUpLeft: "#dpad_ul",
        controlsUpRight: "#dpad_ur",
        controlsDownLeft: "#dpad_dl",
        controlsDownRight: "#dpad_dr",
        controlsO: "#button_O",
        controlsX: "#button_X",
        controlsMenu: "#button_menu",
        controlsFullScreen: "#button_fullscreen",
        controlsMuteToggle: "#button_mute",
    };
    static addLoadedClass() {
        document.body.classList.add("loaded");
    }
    static addStartedClass() {
        document.body.classList.add("started");
    }
    static showError(errorMessage) {
        document.body.classList.add("error");
        document.getElementById("screen_error__message").innerText =
            String(errorMessage);
    }
    static updateMutedClass(isMuted) {
        document.body.classList[isMuted ? "add" : "remove"]("muted");
    }
    static updateBrowsingScreenshotsClass(isBrowsing) {
        document.body.classList[isBrowsing ? "add" : "remove"]("browsing_screenshots");
    }
    static updateScreenshotDownloadLinks(imageDataUrls) {
        const listEl = document.getElementById("screen_screenshots__list");
        listEl.innerHTML = "";
        for (let i = 0; i < imageDataUrls.length; i++) {
            const fileName = `game_screenshot_${imageDataUrls[i].timestamp}.png`;
            const anchorEl = document.createElement("a");
            anchorEl.href = imageDataUrls[i].imageDataUrl;
            anchorEl.download = fileName;
            anchorEl.innerText = fileName;
            const itemEl = document.createElement("li");
            itemEl.appendChild(anchorEl);
            listEl.appendChild(itemEl);
        }
        for (let i = imageDataUrls.length; i < ScreenshotManager.limit; i++) {
            const itemEl = document.createElement("li");
            itemEl.innerHTML = "-";
            listEl.appendChild(itemEl);
        }
    }
    static updateDebugClass(isDebug) {
        document.body.classList[isDebug ? "add" : "remove"]("debug");
    }
    static updatePressedClasses(isPressed) {
        document.body.classList[isPressed.up ? "add" : "remove"]("pressed_u");
        document.body.classList[isPressed.down ? "add" : "remove"]("pressed_d");
        document.body.classList[isPressed.left ? "add" : "remove"]("pressed_l");
        document.body.classList[isPressed.right ? "add" : "remove"]("pressed_r");
        document.body.classList[isPressed.O ? "add" : "remove"]("pressed_O");
        document.body.classList[isPressed.X ? "add" : "remove"]("pressed_X");
        document.body.classList[isPressed.menu ? "add" : "remove"]("pressed_menu");
        document.body.classList[isPressed.mute ? "add" : "remove"]("pressed_mute");
        document.body.classList[isPressed.fullscreen ? "add" : "remove"]("pressed_fullscreen");
    }
}
//# sourceMappingURL=HtmlTemplate.js.map