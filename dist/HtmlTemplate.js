// TODO: rework HTML and selectors
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _a, _HtmlTemplate_gameDisplay;
import { u_ } from "./Utils";
export class HtmlTemplate {
    static updatePressedClasses(isPressed) {
        var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v;
        if (!__classPrivateFieldGet(HtmlTemplate, _a, "f", _HtmlTemplate_gameDisplay)) {
            __classPrivateFieldSet(HtmlTemplate, _a, (_b = document.querySelectorAll(HtmlTemplate.selectors.gameDisplay)[0]) !== null && _b !== void 0 ? _b : u_.throwError(`Was unable to locale a game display under selector "${HtmlTemplate.selectors.gameDisplay}"`), "f", _HtmlTemplate_gameDisplay);
        }
        if (isPressed.up) {
            (_c = __classPrivateFieldGet(HtmlTemplate, _a, "f", _HtmlTemplate_gameDisplay)) === null || _c === void 0 ? void 0 : _c.classList.add("pressed_u");
        }
        else {
            (_d = __classPrivateFieldGet(HtmlTemplate, _a, "f", _HtmlTemplate_gameDisplay)) === null || _d === void 0 ? void 0 : _d.classList.remove("pressed_u");
        }
        if (isPressed.down) {
            (_e = __classPrivateFieldGet(HtmlTemplate, _a, "f", _HtmlTemplate_gameDisplay)) === null || _e === void 0 ? void 0 : _e.classList.add("pressed_d");
        }
        else {
            (_f = __classPrivateFieldGet(HtmlTemplate, _a, "f", _HtmlTemplate_gameDisplay)) === null || _f === void 0 ? void 0 : _f.classList.remove("pressed_d");
        }
        if (isPressed.left) {
            (_g = __classPrivateFieldGet(HtmlTemplate, _a, "f", _HtmlTemplate_gameDisplay)) === null || _g === void 0 ? void 0 : _g.classList.add("pressed_l");
        }
        else {
            (_h = __classPrivateFieldGet(HtmlTemplate, _a, "f", _HtmlTemplate_gameDisplay)) === null || _h === void 0 ? void 0 : _h.classList.remove("pressed_l");
        }
        if (isPressed.right) {
            (_j = __classPrivateFieldGet(HtmlTemplate, _a, "f", _HtmlTemplate_gameDisplay)) === null || _j === void 0 ? void 0 : _j.classList.add("pressed_r");
        }
        else {
            (_k = __classPrivateFieldGet(HtmlTemplate, _a, "f", _HtmlTemplate_gameDisplay)) === null || _k === void 0 ? void 0 : _k.classList.remove("pressed_r");
        }
        if (isPressed.a) {
            (_l = __classPrivateFieldGet(HtmlTemplate, _a, "f", _HtmlTemplate_gameDisplay)) === null || _l === void 0 ? void 0 : _l.classList.add("pressed_a");
        }
        else {
            (_m = __classPrivateFieldGet(HtmlTemplate, _a, "f", _HtmlTemplate_gameDisplay)) === null || _m === void 0 ? void 0 : _m.classList.remove("pressed_a");
        }
        if (isPressed.b) {
            (_o = __classPrivateFieldGet(HtmlTemplate, _a, "f", _HtmlTemplate_gameDisplay)) === null || _o === void 0 ? void 0 : _o.classList.add("pressed_b");
        }
        else {
            (_p = __classPrivateFieldGet(HtmlTemplate, _a, "f", _HtmlTemplate_gameDisplay)) === null || _p === void 0 ? void 0 : _p.classList.remove("pressed_b");
        }
        if (isPressed.menu) {
            (_q = __classPrivateFieldGet(HtmlTemplate, _a, "f", _HtmlTemplate_gameDisplay)) === null || _q === void 0 ? void 0 : _q.classList.add("pressed_menu");
        }
        else {
            (_r = __classPrivateFieldGet(HtmlTemplate, _a, "f", _HtmlTemplate_gameDisplay)) === null || _r === void 0 ? void 0 : _r.classList.remove("pressed_menu");
        }
        if (isPressed.mute) {
            (_s = __classPrivateFieldGet(HtmlTemplate, _a, "f", _HtmlTemplate_gameDisplay)) === null || _s === void 0 ? void 0 : _s.classList.add("pressed_mute");
        }
        else {
            (_t = __classPrivateFieldGet(HtmlTemplate, _a, "f", _HtmlTemplate_gameDisplay)) === null || _t === void 0 ? void 0 : _t.classList.remove("pressed_mute");
        }
        if (isPressed.fullscreen) {
            (_u = __classPrivateFieldGet(HtmlTemplate, _a, "f", _HtmlTemplate_gameDisplay)) === null || _u === void 0 ? void 0 : _u.classList.add("pressed_fullscreen");
        }
        else {
            (_v = __classPrivateFieldGet(HtmlTemplate, _a, "f", _HtmlTemplate_gameDisplay)) === null || _v === void 0 ? void 0 : _v.classList.remove("pressed_fullscreen");
        }
    }
}
_a = HtmlTemplate;
_HtmlTemplate_gameDisplay = { value: void 0 };
HtmlTemplate.selectors = {
    fullScreenSubject: "body",
    canvas: "#game_canvas",
    gameDisplay: "#game_display",
    touchControls: ".touch_control",
    controlsLeft: "#dpad_l",
    controlsRight: "#dpad_r",
    controlsUp: "#dpad_u",
    controlsDown: "#dpad_d",
    controlsA: "#button_a",
    controlsB: "#button_b",
    controlsMenu: "#button_menu",
    controlsFullScreen: "#button_fullscreen",
    controlsMuteToggle: "#button_mute",
};
HtmlTemplate.classes = {
    // TODO: ??? REIMPLEMENT
    canvasDebugBorder: "debug",
    // TODO: ??? REIMPLEMENT
    appLoaded: "game_loaded",
};
