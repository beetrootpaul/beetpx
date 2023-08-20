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
var _a, _MappingColor_nextId, _MappingColor_mapping;
// TODO: split colors into separate files?
export class TransparentColor {
    id() {
        return "transparent";
    }
}
export const transparent_ = new TransparentColor();
// Red, green, and blue, each one as value between 0 and 255.
export class SolidColor {
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
export class CompositeColor {
    constructor(primary, secondary) {
        this.primary = primary;
        this.secondary = secondary;
    }
    id() {
        return `composite:${this.primary.id()}:${this.secondary.id()}`;
    }
}
// TODO: make it a function which allows to implement catch it all color
export class MappingColor {
    constructor(mapping) {
        _MappingColor_mapping.set(this, void 0);
        __classPrivateFieldSet(this, _MappingColor_mapping, mapping, "f");
    }
    getMappedColorFor(r, g, b, a) {
        return __classPrivateFieldGet(this, _MappingColor_mapping, "f").call(this, { r, g, b, a });
    }
    id() {
        var _b, _c, _d;
        return `mapping:${__classPrivateFieldSet(_b = MappingColor, _a, (_d = __classPrivateFieldGet(_b, _a, "f", _MappingColor_nextId), _c = _d++, _d), "f", _MappingColor_nextId), _c}`;
    }
}
_a = MappingColor, _MappingColor_mapping = new WeakMap();
_MappingColor_nextId = { value: 1 };
