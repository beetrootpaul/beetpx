import { type PngDataArray } from "fast-png";
import { BpxRgbColor } from "../color/RgbColor";
import { $rgb } from "../shorthands";
import { BpxSprite } from "../sprite/Sprite";
import { range } from "../utils/range";

export type PreparedSprite = {
  w: number;
  h: number;
  colors: (BpxRgbColor | null)[][];
  // true  = it was taken from a cache
  // false = miss, had to prepare a sprite
  cacheHit: boolean;
};

export class PreparedSprites {
  readonly #cache: Map<string, PreparedSprite> = new Map();

  prepareOrGetFromCache(
    sprite: BpxSprite,
    flipXy: [boolean, boolean],
    imgBytes: PngDataArray,
    imgW: number,
    imgChannels: 3 | 4,
  ): PreparedSprite {
    const key =
      sprite.imageUrl +
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
      return this.#cache.get(key)!;
    }

    const w = sprite.size.x;
    const h = sprite.size.y;

    const colors: (BpxRgbColor | null)[][] = range(w).map(() =>
      range(h).map(() => null),
    );

    for (let sY = 0; sY < h; ++sY) {
      const imgY = sprite.xy.y + (flipXy[1] ? h - sY - 1 : sY);
      for (let sX = 0; sX < w; ++sX) {
        const imgX = sprite.xy.x + (flipXy[0] ? w - sX - 1 : sX);

        const imgIndex = (imgY * imgW + imgX) * imgChannels;

        colors[sX]![sY] =
          imgChannels === 3
            ? $rgb(
                imgBytes[imgIndex]!,
                imgBytes[imgIndex + 1]!,
                imgBytes[imgIndex + 2]!,
              )
            : imgBytes[imgIndex + 3]! >= 0xff / 2
              ? $rgb(
                  imgBytes[imgIndex]!,
                  imgBytes[imgIndex + 1]!,
                  imgBytes[imgIndex + 2]!,
                )
              : null;
      }
    }

    const preparedSprite: PreparedSprite = {
      w: sprite.size.x,
      h: sprite.size.y,
      colors: colors,
      cacheHit: true,
    };
    this.#cache.set(key, preparedSprite);

    return { ...preparedSprite, cacheHit: false };
  }
}
