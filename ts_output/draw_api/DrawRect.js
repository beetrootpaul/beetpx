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
var _DrawRect_canvasBytes, _DrawRect_canvasSize, _DrawRect_pixel;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DrawRect = void 0;
const Color_1 = require("../Color");
const Xy_1 = require("../Xy");
const DrawPixel_1 = require("./DrawPixel");
const FillPattern_1 = require("./FillPattern");
class DrawRect {
    constructor(canvasBytes, canvasSize) {
        _DrawRect_canvasBytes.set(this, void 0);
        _DrawRect_canvasSize.set(this, void 0);
        _DrawRect_pixel.set(this, void 0);
        __classPrivateFieldSet(this, _DrawRect_canvasBytes, canvasBytes, "f");
        __classPrivateFieldSet(this, _DrawRect_canvasSize, canvasSize, "f");
        __classPrivateFieldSet(this, _DrawRect_pixel, new DrawPixel_1.DrawPixel(__classPrivateFieldGet(this, _DrawRect_canvasBytes, "f"), __classPrivateFieldGet(this, _DrawRect_canvasSize, "f")), "f");
    }
    draw(xy1, xy2, color, fill, fillPattern = FillPattern_1.FillPattern.primaryOnly) {
        Xy_1.Xy.forEachIntXyWithinRectOf(xy1, xy2, fill, (xy) => {
            if (fillPattern.hasPrimaryColorAt(xy)) {
                if (color instanceof Color_1.CompositeColor) {
                    if (color.primary instanceof Color_1.SolidColor) {
                        __classPrivateFieldGet(this, _DrawRect_pixel, "f").draw(xy, color.primary);
                    }
                }
                else {
                    __classPrivateFieldGet(this, _DrawRect_pixel, "f").draw(xy, color);
                }
            }
            else {
                if (color instanceof Color_1.CompositeColor) {
                    if (color.secondary instanceof Color_1.SolidColor) {
                        __classPrivateFieldGet(this, _DrawRect_pixel, "f").draw(xy, color.secondary);
                    }
                }
            }
        });
    }
}
exports.DrawRect = DrawRect;
_DrawRect_canvasBytes = new WeakMap(), _DrawRect_canvasSize = new WeakMap(), _DrawRect_pixel = new WeakMap();
