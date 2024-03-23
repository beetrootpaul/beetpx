var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _GameInputKeyboard_keyMapping, _GameInputKeyboard_eventsSinceLastUpdate;
export class GameInputKeyboard {
    constructor(params) {
        this.inputMethod = "keyboard";
        _GameInputKeyboard_keyMapping.set(this, new Map([
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
            ["j", "button_a"],
            ["J", "button_a"],
            ["k", "button_b"],
            ["K", "button_b"],
            ["c", "button_a"],
            ["C", "button_a"],
            ["x", "button_b"],
            ["x", "button_b"],
            ["p", "button_menu"],
            ["P", "button_menu"],
            ["Escape", "button_menu"],
            ["Enter", "button_menu"],
            ["m", "mute_unmute_toggle"],
            ["M", "mute_unmute_toggle"],
            ["f", "full_screen"],
            ["F", "full_screen"],
        ]));
        _GameInputKeyboard_eventsSinceLastUpdate.set(this, new Set());
        if (params.enableDebugToggle) {
            __classPrivateFieldGet(this, _GameInputKeyboard_keyMapping, "f").set(";", "debug_toggle");
        }
        if (params.enabledFrameByFrameControls) {
            __classPrivateFieldGet(this, _GameInputKeyboard_keyMapping, "f").set(",", "frame_by_frame_toggle");
            __classPrivateFieldGet(this, _GameInputKeyboard_keyMapping, "f").set(".", "frame_by_frame_step");
        }
    }
    startListening() {
        document.addEventListener("keydown", (keyboardEvent) => {
            const gameInputEvent = __classPrivateFieldGet(this, _GameInputKeyboard_keyMapping, "f").get(keyboardEvent.key);
            if (gameInputEvent) {
                keyboardEvent.preventDefault();
                __classPrivateFieldGet(this, _GameInputKeyboard_eventsSinceLastUpdate, "f").add(gameInputEvent);
            }
        });
        document.addEventListener("keyup", (keyboardEvent) => {
            const gameInputEvent = __classPrivateFieldGet(this, _GameInputKeyboard_keyMapping, "f").get(keyboardEvent.key);
            if (gameInputEvent) {
                keyboardEvent.preventDefault();
                __classPrivateFieldGet(this, _GameInputKeyboard_eventsSinceLastUpdate, "f").delete(gameInputEvent);
            }
        });
    }
    update(eventsCollector) {
        let anythingAdded = false;
        for (const event of __classPrivateFieldGet(this, _GameInputKeyboard_eventsSinceLastUpdate, "f")) {
            eventsCollector.add(event);
            anythingAdded = true;
        }
        
        
        
        
        
        
        
        
        __classPrivateFieldGet(this, _GameInputKeyboard_eventsSinceLastUpdate, "f").delete("full_screen");
        return anythingAdded;
    }
}
_GameInputKeyboard_keyMapping = new WeakMap(), _GameInputKeyboard_eventsSinceLastUpdate = new WeakMap();
