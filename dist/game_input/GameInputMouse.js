var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _GameInputMouse_eventsSinceLastUpdate;
import { HtmlTemplate } from "../HtmlTemplate";
export class GameInputMouse {
    constructor() {
        this.inputMethod = "mouse";
        _GameInputMouse_eventsSinceLastUpdate.set(this, new Set());
    }
    startListening() {
        GameInputMouse.mapping.forEach(({ event, selector }) => {
            document.querySelectorAll(selector).forEach((button) => {
                button.addEventListener("mousedown", () => {
                    __classPrivateFieldGet(this, _GameInputMouse_eventsSinceLastUpdate, "f").add(event);
                });
                button.addEventListener("mouseup", () => {
                    __classPrivateFieldGet(this, _GameInputMouse_eventsSinceLastUpdate, "f").delete(event);
                });
            });
        });
    }
    update(eventsCollector) {
        let anythingAdded = false;
        for (const event of __classPrivateFieldGet(this, _GameInputMouse_eventsSinceLastUpdate, "f")) {
            eventsCollector.add(event);
            anythingAdded = true;
        }
        
        
        
        
        
        
        
        
        __classPrivateFieldGet(this, _GameInputMouse_eventsSinceLastUpdate, "f").delete("full_screen");
        return anythingAdded;
    }
}
_GameInputMouse_eventsSinceLastUpdate = new WeakMap();
GameInputMouse.mapping = [
    { event: "button_left", selector: HtmlTemplate.selectors.controlsLeft },
    { event: "button_left", selector: HtmlTemplate.selectors.controlsUpLeft },
    { event: "button_left", selector: HtmlTemplate.selectors.controlsDownLeft },
    { event: "button_right", selector: HtmlTemplate.selectors.controlsRight },
    { event: "button_right", selector: HtmlTemplate.selectors.controlsUpRight },
    {
        event: "button_right",
        selector: HtmlTemplate.selectors.controlsDownRight,
    },
    { event: "button_up", selector: HtmlTemplate.selectors.controlsUp },
    { event: "button_up", selector: HtmlTemplate.selectors.controlsUpLeft },
    { event: "button_up", selector: HtmlTemplate.selectors.controlsUpRight },
    { event: "button_down", selector: HtmlTemplate.selectors.controlsDown },
    { event: "button_down", selector: HtmlTemplate.selectors.controlsDownLeft },
    {
        event: "button_down",
        selector: HtmlTemplate.selectors.controlsDownRight,
    },
    { event: "button_a", selector: HtmlTemplate.selectors.controlsA },
    { event: "button_b", selector: HtmlTemplate.selectors.controlsB },
    { event: "button_menu", selector: HtmlTemplate.selectors.controlsMenu },
    {
        event: "mute_unmute_toggle",
        selector: HtmlTemplate.selectors.controlsMuteToggle,
    },
    {
        event: "full_screen",
        selector: HtmlTemplate.selectors.controlsFullScreen,
    },
];
