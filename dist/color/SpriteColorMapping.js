import { $v } from "../shorthands";
export class BpxSpriteColorMapping {
    static noMapping = new BpxSpriteColorMapping((c, _xy) => c);
    static from(colorMappingEntries) {
        const map = new Map(colorMappingEntries.map(([from, to]) => [from.cssHex, to]));
        return new BpxSpriteColorMapping((spriteColor, _xy) => {
            if (!spriteColor)
                return spriteColor;
            const mapped = map.get(spriteColor.cssHex);
            return typeof mapped === "undefined" ? spriteColor : mapped;
        });
    }
    static of(mapping) {
        return new BpxSpriteColorMapping(mapping);
    }
    type = "sprite_mapping";
    #mapping;
    constructor(mapping) {
        this.#mapping = mapping;
    }
    getMappedColor(spriteColor, spriteX, spriteY) {
        return this.#mapping(spriteColor, $v(spriteX, spriteY));
    }
}
