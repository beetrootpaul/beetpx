"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompositeColor = exports.SolidColor = exports.transparent_ = exports.TransparentColor = void 0;
class TransparentColor {
    id() {
        return "transparent";
    }
}
exports.TransparentColor = TransparentColor;
exports.transparent_ = new TransparentColor();
// Red, green, and blue, each one as value between 0 and 255.
class SolidColor {
    constructor(r, g, b) {
        if (r < 0 || r > 255 || g < 0 || g > 255 || b < 0 || b > 255) {
            throw Error(`One of color components is outside 0-255 range: r=${r}, g=${g}, b=${b}.`);
        }
        this.r = r;
        this.g = g;
        this.b = b;
    }
    id() {
        return "solid-" + this.asRgbCssHex();
    }
    asRgbCssHex() {
        return ("#" +
            this.r.toString(16).padStart(2, "0") +
            this.g.toString(16).padStart(2, "0") +
            this.b.toString(16).padStart(2, "0"));
    }
    static fromRgbCssHex(cssHex) {
        if (!/^#[0-9a-fA-F]{6}$/.test(cssHex)) {
            throw Error("Hexadecimal representation of the color doesn't contain exactly 6 hexadecimal digits, preceded by a single '#'");
        }
        return new SolidColor(parseInt(cssHex.slice(1, 3), 16), parseInt(cssHex.slice(3, 5), 16), parseInt(cssHex.slice(5, 7), 16));
    }
}
exports.SolidColor = SolidColor;
class CompositeColor {
    constructor(primary, secondary) {
        this.primary = primary;
        this.secondary = secondary;
    }
    id() {
        return `composite:${this.primary.id()}:${this.secondary.id()}`;
    }
}
exports.CompositeColor = CompositeColor;
