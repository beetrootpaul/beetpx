export class BpxSpriteColorMapping {
    static noMapping = BpxSpriteColorMapping.of((c, _x, _y) => c);
    static from(colorMappingEntries) {
        const map = new Map(colorMappingEntries.map(([from, to]) => [from.cssHex, to]));
        return new BpxSpriteColorMapping((spriteColor, _x, _y) => {
            if (!spriteColor)
                return spriteColor;
            const mapped = map.get(spriteColor.cssHex);
            return typeof mapped === "undefined" ? spriteColor : mapped;
        });
    }
    static of(mapper) {
        return new BpxSpriteColorMapping(mapper);
    }
    type = "sprite_mapping";
    #mapping;
    constructor(mapping) {
        this.#mapping = mapping;
    }
    getMappedColor(spriteColor, spriteX, spriteY) {
        return this.#mapping(spriteColor, spriteX, spriteY);
    }
}
//# sourceMappingURL=SpriteColorMapping.js.map