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
var _BpxSpriteColorMapping_mapping;
export class BpxSpriteColorMapping {
    static from(colorMappingEntries) {
        const map = new Map(colorMappingEntries.map(([from, to]) => [from.cssHex, to]));
        return new BpxSpriteColorMapping((spriteColor) => {
            if (!spriteColor)
                return spriteColor;
            const mapped = map.get(spriteColor.cssHex);
            return typeof mapped === "undefined" ? spriteColor : mapped;
        });
    }
    static of(mapping) {
        return new BpxSpriteColorMapping(mapping);
    }
    constructor(mapping) {
        this.type = "sprite_mapping";
        _BpxSpriteColorMapping_mapping.set(this, void 0);
        __classPrivateFieldSet(this, _BpxSpriteColorMapping_mapping, mapping, "f");
    }
    getMappedColor(spriteColor) {
        return __classPrivateFieldGet(this, _BpxSpriteColorMapping_mapping, "f").call(this, spriteColor);
    }
}
_BpxSpriteColorMapping_mapping = new WeakMap();

BpxSpriteColorMapping.noMapping = new BpxSpriteColorMapping((c) => c);
