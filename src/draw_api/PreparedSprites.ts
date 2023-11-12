import { type PngDataArray } from "fast-png";
import { u_ } from "../Utils";
import { BpxSolidColor } from "../color/SolidColor";
import { BpxTransparentColor, transparent_ } from "../color/TransparentColor";
import { BpxSprite } from "./Sprite";

export type PreparedSprite = {
  w: number;
  h: number;
  colors: (BpxSolidColor | BpxTransparentColor)[][];
};

export class PreparedSprites {
  readonly #cache: Map<string, PreparedSprite> = new Map();

  prepareOrGetFromCache(
    sprite: BpxSprite,
    imgBytes: PngDataArray,
    imgW: number,
    imgChannels: 3 | 4,
  ): PreparedSprite {
    const key =
      sprite.imageUrl +
      "::" +
      sprite.xy1.x.toString() +
      ":" +
      sprite.xy1.y.toString() +
      ":" +
      sprite.xy2.x.toString() +
      ":" +
      sprite.xy2.y.toString();

    if (this.#cache.has(key)) {
      return this.#cache.get(key)!;
    }

    const w = sprite.size().x;
    const h = sprite.size().y;

    const colors: (BpxSolidColor | BpxTransparentColor)[][] = u_
      .range(w)
      .map(() => u_.range(h).map(() => transparent_));

    for (let spriteY = 0; spriteY < h; ++spriteY) {
      const imgY = sprite.xy1.y + spriteY;
      for (let spriteX = 0; spriteX < w; ++spriteX) {
        const imgX = sprite.xy1.x + spriteX;

        const imgIndex = (imgY * imgW + imgX) * imgChannels;

        const color: BpxSolidColor | BpxTransparentColor =
          imgChannels === 3
            ? new BpxSolidColor(
                imgBytes[imgIndex]!,
                imgBytes[imgIndex + 1]!,
                imgBytes[imgIndex + 2]!,
              )
            : imgBytes[imgIndex + 3]! >= 0xff / 2
            ? new BpxSolidColor(
                imgBytes[imgIndex]!,
                imgBytes[imgIndex + 1]!,
                imgBytes[imgIndex + 2]!,
              )
            : transparent_;

        colors[spriteX]![spriteY] = color;
      }
    }

    const preparedSprite: PreparedSprite = {
      w: sprite.size().x,
      h: sprite.size().y,
      colors: colors,
    };
    this.#cache.set(key, preparedSprite);

    return preparedSprite;
  }
}
