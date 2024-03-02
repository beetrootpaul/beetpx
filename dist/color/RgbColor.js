export class BpxRgbColor {
    static of(r, g, b) {
        return new BpxRgbColor(r, g, b);
    }
    static fromCssHex(cssHex) {
        if (!/^#[0-9a-fA-F]{6}$/.test(cssHex)) {
            throw Error("Hexadecimal representation of the color doesn't contain exactly 6 hexadecimal digits, preceded by a single '#'");
        }
        return new BpxRgbColor(parseInt(cssHex.slice(1, 3), 16), parseInt(cssHex.slice(3, 5), 16), parseInt(cssHex.slice(5, 7), 16));
    }
    constructor(r, g, b) {
        this.type = "rgb";
        this.r = Math.min(Math.max(0x00, Math.round(r)), 0xff);
        this.g = Math.min(Math.max(0x00, Math.round(g)), 0xff);
        this.b = Math.min(Math.max(0x00, Math.round(b)), 0xff);
        this.cssHex =
            "#" +
                r.toString(16).padStart(2, "0") +
                g.toString(16).padStart(2, "0") +
                b.toString(16).padStart(2, "0");
    }
    asArray() {
        return [this.r, this.g, this.b];
    }
}
export function rgb_(r, g, b) {
    return BpxRgbColor.of(r, g, b);
}
export const black_ = BpxRgbColor.fromCssHex("#000000");
export const white_ = BpxRgbColor.fromCssHex("#ffffff");
export const red_ = BpxRgbColor.fromCssHex("#ff0000");
export const green_ = BpxRgbColor.fromCssHex("#00ff00");
export const blue_ = BpxRgbColor.fromCssHex("#0000ff");
export const yellow_ = BpxRgbColor.fromCssHex("#ffff00");
export const cyan_ = BpxRgbColor.fromCssHex("#00ffff");
export const magenta_ = BpxRgbColor.fromCssHex("#ff00ff");
