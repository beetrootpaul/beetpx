import { type PngDataArray } from "fast-png";
import { u_ } from "../Utils";
import {
  BpxColorId,
  BpxSolidColor,
  BpxTransparentColor,
  transparent_,
} from "../misc/Color";
import { BpxSprite } from "./Sprite";

export type PreparedSprite = {
  w: number;
  h: number;
  colors: (BpxSolidColor | null)[][];
};

export class PreparedSprites {
  readonly #cache: Map<string, PreparedSprite> = new Map();

  prepareOrGetFromCache(
    sprite: BpxSprite,
    imgBytes: PngDataArray,
    imgW: number,
    imgChannels: 3 | 4,
    // TODO: consider making color mapping into a class, especially that we need an unique ID out of it later on
    colorMapping: Map<BpxColorId, BpxSolidColor | BpxTransparentColor>,
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
      sprite.xy2.y.toString() +
      "::" +
      this.#keyPortionFromColorMapping(colorMapping);

    if (this.#cache.has(key)) {
      return this.#cache.get(key)!;
    }

    const w = sprite.size().x;
    const h = sprite.size().y;

    const colors: (BpxSolidColor | null)[][] = u_
      .range(w)
      .map(() => u_.range(h).map(() => null));

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

        const mappedColor = colorMapping.get(color.id) ?? color;

        colors[spriteX]![spriteY] =
          mappedColor instanceof BpxSolidColor ? mappedColor : null;
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

  #keyPortionFromColorMapping(
    colorMapping: Map<BpxColorId, BpxSolidColor | BpxTransparentColor>,
  ): string {
    return Array.from(colorMapping.entries())
      .map(([fromId, colorTo]) => fromId + ">" + colorTo.id)
      .join(":");
  }
}
