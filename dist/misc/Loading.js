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
var _Loading_minWaitToAvoidFlicker, _Loading_startButton, _Loading_startClicked;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Loading = void 0;
const HtmlTemplate_1 = require("../HtmlTemplate");
const Utils_1 = require("../Utils");
class Loading {
    constructor(params) {
        _Loading_minWaitToAvoidFlicker.set(this, Utils_1.u_.wait(750));
        _Loading_startButton.set(this, void 0);
        _Loading_startClicked.set(this, void 0);
        __classPrivateFieldSet(this, _Loading_startButton, document.querySelector(HtmlTemplate_1.HtmlTemplate.selectors.startButton) ??
            Utils_1.u_.throwError(`Unable to find a start button under a selector "${HtmlTemplate_1.HtmlTemplate.selectors.startButton}"`), "f");
        __classPrivateFieldSet(this, _Loading_startClicked, new Promise((resolve) => {
            __classPrivateFieldGet(this, _Loading_startButton, "f").addEventListener("click", () => {
                params.onStartClicked();
                resolve();
            });
        }), "f");
    }
    async showStartScreen() {
        await __classPrivateFieldGet(this, _Loading_minWaitToAvoidFlicker, "f");
        HtmlTemplate_1.HtmlTemplate.addLoadedClass();
        __classPrivateFieldGet(this, _Loading_startButton, "f").focus();
        await __classPrivateFieldGet(this, _Loading_startClicked, "f");
        HtmlTemplate_1.HtmlTemplate.addStartedClass();
    }
}
exports.Loading = Loading;
_Loading_minWaitToAvoidFlicker = new WeakMap(), _Loading_startButton = new WeakMap(), _Loading_startClicked = new WeakMap();
