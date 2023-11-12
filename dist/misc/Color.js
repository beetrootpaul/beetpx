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
var _BpxTransparentColor_nominalTypeHelper__transparent, _BpxSolidColor_nominalTypeHelper__solid, _BpxCompositeColor_nominalTypeHelper__composite, _a, _BpxMappingColor_nextId, _BpxMappingColor_nominalTypeHelper__mapping;
export class BpxTransparentColor {
    constructor() {
        
        
        
        _BpxTransparentColor_nominalTypeHelper__transparent.set(this, true);
        this.id = "transparent";
    }
}
_BpxTransparentColor_nominalTypeHelper__transparent = new WeakMap();
export const transparent_ = new BpxTransparentColor();

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
export class BpxCompositeColor {
    constructor(primary, secondary) {
        
        _BpxCompositeColor_nominalTypeHelper__composite.set(this, true);
        this.primary = primary;
        this.secondary = secondary;
        this.id = `composite:${this.primary.id}:${this.secondary.id}`;
    }
}
_BpxCompositeColor_nominalTypeHelper__composite = new WeakMap();

export class BpxMappingColor {
    constructor(snapshotId, mapping) {
        var _b, _c, _d;
        
        _BpxMappingColor_nominalTypeHelper__mapping.set(this, true);
        this.id = `mapping:${__classPrivateFieldSet(_b = BpxMappingColor, _a, (_d = __classPrivateFieldGet(_b, _a, "f", _BpxMappingColor_nextId), _c = _d++, _d), "f", _BpxMappingColor_nextId), _c}`;
        this.snapshotId = snapshotId;
        this.getMappedColorFromCanvasSnapshot = (snapshot, index) => mapping(snapshot.get(index));
    }
}
_a = BpxMappingColor, _BpxMappingColor_nominalTypeHelper__mapping = new WeakMap();
_BpxMappingColor_nextId = { value: 1 };
