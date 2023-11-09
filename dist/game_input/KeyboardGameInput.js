var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _KeyboardGameInput_keyMapping, _KeyboardGameInput_eventsSinceLastUpdate;
export class KeyboardGameInput {
    constructor(params) {
        this.inputMethod = "keyboard";
        _KeyboardGameInput_keyMapping.set(this, new Map([
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
        _KeyboardGameInput_eventsSinceLastUpdate.set(this, new Set());
        if (params.enableDebugInputs) {
            __classPrivateFieldGet(this, _KeyboardGameInput_keyMapping, "f").set(";", "debug_toggle");
            __classPrivateFieldGet(this, _KeyboardGameInput_keyMapping, "f").set(",", "frame_by_frame_toggle");
            __classPrivateFieldGet(this, _KeyboardGameInput_keyMapping, "f").set(".", "frame_by_frame_step");
        }
    }
    startListening() {
        document.addEventListener("keydown", (keyboardEvent) => {
            const gameInputEvent = __classPrivateFieldGet(this, _KeyboardGameInput_keyMapping, "f").get(keyboardEvent.key);
            if (gameInputEvent) {
                keyboardEvent.preventDefault();
                __classPrivateFieldGet(this, _KeyboardGameInput_eventsSinceLastUpdate, "f").add(gameInputEvent);
            }
        });
        document.addEventListener("keyup", (keyboardEvent) => {
            const gameInputEvent = __classPrivateFieldGet(this, _KeyboardGameInput_keyMapping, "f").get(keyboardEvent.key);
            if (gameInputEvent) {
                keyboardEvent.preventDefault();
                __classPrivateFieldGet(this, _KeyboardGameInput_eventsSinceLastUpdate, "f").delete(gameInputEvent);
            }
        });
    }
    update(eventsCollector) {
        let anythingAdded = false;
        for (const event of __classPrivateFieldGet(this, _KeyboardGameInput_eventsSinceLastUpdate, "f")) {
            eventsCollector.add(event);
            anythingAdded = true;
        }
        // On macOS Chrome and Safari "keyup" (for a full screen toggle key) is
        //   not registered during full screen transition. If user presses the key
        //   for a typical short duration, it ends up recognized as still pressed
        //   after the full screen transition ends. Therefore, in order to toggle
        //   full screen back, user has to press the key twice: once to "release"
        //   the key, and second time to initiate the next full screen transition.
        // As a workaround we do not keep "full_screen" event "pressed", so the framework
        //   will recognize it as a key being up immediately.
        __classPrivateFieldGet(this, _KeyboardGameInput_eventsSinceLastUpdate, "f").delete("full_screen");
        return anythingAdded;
    }
}
_KeyboardGameInput_keyMapping = new WeakMap(), _KeyboardGameInput_eventsSinceLastUpdate = new WeakMap();
