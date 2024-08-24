import { $rgb } from "../shorthands";
import { range } from "../utils/range";
export class PreparedSprites {
    #cache = new Map();
    prepareOrGetFromCache(sprite, flipXy, imgBytes, imgW, imgChannels) {
        const key = sprite.imageUrl +
            "::" +
            sprite.xy.x.toString() +
            ":" +
            sprite.xy.y.toString() +
            ":" +
            sprite.size.x.toString() +
            ":" +
            sprite.size.y.toString() +
            ":" +
            flipXy[0].toString() +
            ":" +
            flipXy[1].toString();
        if (this.#cache.has(key)) {
            return this.#cache.get(key);
        }
        const w = sprite.size.x;
        const h = sprite.size.y;
        const colors = range(w).map(() => range(h).map(() => null));
        for (let sY = 0; sY < h; ++sY) {
            const imgY = sprite.xy.y + (flipXy[1] ? h - sY - 1 : sY);
            for (let sX = 0; sX < w; ++sX) {
                const imgX = sprite.xy.x + (flipXy[0] ? w - sX - 1 : sX);
                const imgIndex = (imgY * imgW + imgX) * imgChannels;
                colors[sX][sY] =
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