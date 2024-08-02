export class GameInputKeyboard {
    inputMethod = "keyboard";
    #keyMapping = new Map([
        ["ArrowLeft", "button_left"],
        ["ArrowRight", "button_right"],
        ["ArrowUp", "button_up"],
        ["ArrowDown", "button_down"],
        ["w", "button_up"],
        ["W", "button_up"],
        ["s", "button_down"],
        ["S", "button_down"],
        ["a", "button_left"],
        ["A", "button_left"],
        ["d", "button_right"],
        ["D", "button_right"],
        ["j", "button_O"],
        ["J", "button_O"],
        ["k", "button_X"],
        ["K", "button_X"],
        ["c", "button_O"],
        ["C", "button_O"],
        ["x", "button_X"],
        ["x", "button_X"],
        ["o", "button_O"],
        ["O", "button_O"],
        ["p", "button_menu"],
        ["P", "button_menu"],
        ["Escape", "button_menu"],
        ["Enter", "button_menu"],
        ["m", "mute_unmute_toggle"],
        ["M", "mute_unmute_toggle"],
        ["f", "full_screen"],
        ["F", "full_screen"],
    ]);
    #eventsSinceLastUpdate = new Set();
    constructor(params) {
        if (params.enableScreenshots) {
            this.#keyMapping.set("]", "take_screenshot");
            this.#keyMapping.set("}", "browse_screenshots_toggle");
        }
        if (params.enableDebugToggle) {
            this.#keyMapping.set(";", "debug_toggle");
        }
        if (params.enableFrameByFrameControls) {
            this.#keyMapping.set(",", "frame_by_frame_toggle");
            this.#keyMapping.set(".", "frame_by_frame_step");
        }
    }
    startListening() {
        document.addEventListener("keydown", (keyboardEvent) => {
            const gameInputEvent = this.#keyMapping.get(keyboardEvent.key);
            if (gameInputEvent) {
                keyboardEvent.preventDefault();
                this.#eventsSinceLastUpdate.add(gameInputEvent);
            }
        });
        document.addEventListener("keyup", (keyboardEvent) => {
            const gameInputEvent = this.#keyMapping.get(keyboardEvent.key);
            if (gameInputEvent) {
                keyboardEvent.preventDefault();
                this.#eventsSinceLastUpdate.delete(gameInputEvent);
            }
        });
    }
    update(eventsCollector) {
        let anythingAdded = false;
        for (const event of this.#eventsSinceLastUpdate) {
            eventsCollector.add(event);
            anythingAdded = true;
        }
        this.#eventsSinceLastUpdate.delete("full_screen");
        return anythingAdded;
    }
}
//# sourceMappingURL=GameInputKeyboard.js.map