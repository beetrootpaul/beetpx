"use strict";
// TODO: When the loading of assets gets implemented, we will have to wait a bit more for the game to start.
//      We will need a minimum wait then in order to avoid a case when game loads super fast, making the loading screen flicker.
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _Loading_displayElement;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Loading = void 0;
class Loading {
    constructor(htmlDisplaySelector) {
        _Loading_displayElement.set(this, void 0);
        const displayElement = document.querySelector(htmlDisplaySelector);
        if (!displayElement) {
            throw Error(`Was unable to find a display element by selector '${htmlDisplaySelector}'`);
        }
        __classPrivateFieldSet(this, _Loading_displayElement, displayElement, "f");
    }
    // TODO: rename to hideLoadingScreen maybe?
    showApp() {
        // TODO: externalize this class as a parameter coming from the game itself
        document.body.classList.add("app_loaded");
    }
}
exports.Loading = Loading;
_Loading_displayElement = new WeakMap();
