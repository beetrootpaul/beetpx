"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _MouseGameInput_params, _MouseGameInput_eventsSinceLastUpdate;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MouseGameInput = void 0;
class MouseGameInput {
    constructor(params) {
        _MouseGameInput_params.set(this, void 0);
        _MouseGameInput_eventsSinceLastUpdate.set(this, new Set());
        __classPrivateFieldSet(this, _MouseGameInput_params, params, "f");
    }
    startListening() {
        document
            .querySelectorAll(__classPrivateFieldGet(this, _MouseGameInput_params, "f").muteButtonsSelector)
            .forEach((button) => {
            button.addEventListener("click", () => {
                __classPrivateFieldGet(this, _MouseGameInput_eventsSinceLastUpdate, "f").add("mute_unmute_toggle");
            });
        });
        document
            .querySelectorAll(__classPrivateFieldGet(this, _MouseGameInput_params, "f").fullScreenButtonsSelector)
            .forEach((button) => {
            button.addEventListener("click", () => {
                __classPrivateFieldGet(this, _MouseGameInput_eventsSinceLastUpdate, "f").add("full_screen");
            });
        });
    }
    update(eventsCollector) {
        for (const event of __classPrivateFieldGet(this, _MouseGameInput_eventsSinceLastUpdate, "f")) {
            eventsCollector.add(event);
        }
        __classPrivateFieldGet(this, _MouseGameInput_eventsSinceLastUpdate, "f").clear();
    }
}
exports.MouseGameInput = MouseGameInput;
_MouseGameInput_params = new WeakMap(), _MouseGameInput_eventsSinceLastUpdate = new WeakMap();
