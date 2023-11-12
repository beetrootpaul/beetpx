var _BpxSolidColor_nominalTypeHelper__solid;
export class BpxSolidColor {
    constructor(r, g, b) {
        
        _BpxSolidColor_nominalTypeHelper__solid.set(this, true);
        if (r < 0 || r > 255 || g < 0 || g > 255 || b < 0 || b > 255) {
            throw Error(`One of color components is outside 0-255 range: r=${r}, g=${g}, b=${b}.`);
        }
        this.r = r;
        this.g = g;
        this.b = b;
        this.id = "solid-" + this.asRgbCssHex();
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
        return new BpxSolidColor(parseInt(cssHex.slice(1, 3), 16), parseInt(cssHex.slice(3, 5), 16), parseInt(cssHex.slice(5, 7), 16));
    }
}
_BpxSolidColor_nominalTypeHelper__solid = new WeakMap();
export const black_ = BpxSolidColor.fromRgbCssHex("#000000");
export const white_ = BpxSolidColor.fromRgbCssHex("#ffffff");
export const red_ = BpxSolidColor.fromRgbCssHex("#ff0000");
export const green_ = BpxSolidColor.fromRgbCssHex("#00ff00");
export const blue_ = BpxSolidColor.fromRgbCssHex("#0000ff");
