var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
import { HtmlTemplate } from "./HtmlTemplate";
import { u_ } from "./Utils";
export class Loading {
    constructor(params) {
        var _a;
        _Loading_minWaitToAvoidFlicker.set(this, u_.wait(750));
        _Loading_startButton.set(this, void 0);
        _Loading_startClicked.set(this, void 0);
        __classPrivateFieldSet(this, _Loading_startButton, (_a = document.querySelector(HtmlTemplate.selectors.startButton)) !== null && _a !== void 0 ? _a : u_.throwError(`Unable to find a start button under a selector "${HtmlTemplate.selectors.startButton}"`), "f");
        __classPrivateFieldSet(this, _Loading_startClicked, new Promise((resolve) => {
            __classPrivateFieldGet(this, _Loading_startButton, "f").addEventListener("click", () => {
                params.onStartClicked();
                resolve();
            });
        }), "f");
    }
    showStartScreen() {
        return __awaiter(this, void 0, void 0, function* () {
            yield __classPrivateFieldGet(this, _Loading_minWaitToAvoidFlicker, "f");
            HtmlTemplate.addLoadedClass();
            __classPrivateFieldGet(this, _Loading_startButton, "f").focus();
            yield __classPrivateFieldGet(this, _Loading_startClicked, "f");
            HtmlTemplate.addStartedClass();
        });
    }
}
_Loading_minWaitToAvoidFlicker = new WeakMap(), _Loading_startButton = new WeakMap(), _Loading_startClicked = new WeakMap();
