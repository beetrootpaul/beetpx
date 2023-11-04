// TODO: add some loading animation
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Loading_minWaitToAvoidFlicker;
import { HtmlTemplate } from "./HtmlTemplate";
import { u_ } from "./Utils";
export class Loading {
    constructor() {
        _Loading_minWaitToAvoidFlicker.set(this, u_.wait(1000));
    }
    showApp() {
        return __awaiter(this, void 0, void 0, function* () {
            yield __classPrivateFieldGet(this, _Loading_minWaitToAvoidFlicker, "f");
            HtmlTemplate.addLoadedClass();
        });
    }
}
_Loading_minWaitToAvoidFlicker = new WeakMap();
