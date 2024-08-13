import { $rgb } from "../shorthands";
import { range } from "../utils/range";
export class PreparedSprites {
    #cache = new Map();
    prepareOrGetFromCache(sprite, imgBytes, imgW, imgChannels) {
        const key = sprite.imageUrl +
            "::" +
            sprite.xy.x.toString() +
            ":" +
            sprite.xy.y.toString() +
            ":" +
            sprite.size.x.toString() +
            ":" +
            sprite.size.y.toString();
        if (this.#cache.has(key)) {
            return this.#cache.get(key);
        }
        const w = sprite.size.x;
        const h = sprite.size.y;
        const colors = range(w).map(() => range(h).map(() => null));
        for (let spriteY = 0; spriteY < h; ++spriteY) {
            const imgY = sprite.xy.y + spriteY;
            for (let spriteX = 0; spriteX < w; ++spriteX) {
                const imgX = sprite.xy.x + spriteX;
                const imgIndex = (imgY * imgW + imgX) * imgChannels;
                colors[spriteX][spriteY] =
                    imgChannels === 3
                        ? $rgb(imgBytes[imgIndex], imgBytes[imgIndex + 1], imgBytes[imgIndex + 2])
                        : imgBytes[imgIndex + 3] >= 0xff / 2
                            ? $rgb(imgBytes[imgIndex], imgBytes[imgIndex + 1], imgBytes[imgIndex + 2])
                            : null;
            }
        }
        const preparedSprite = {
            w: sprite.size.x,
            h: sprite.size.y,
            colors: colors,
            cacheHit: true,
        };
        this.#cache.set(key, preparedSprite);
        return { ...preparedSprite, cacheHit: false };
    }
}
//# sourceMappingURL=PreparedSprites.js.map