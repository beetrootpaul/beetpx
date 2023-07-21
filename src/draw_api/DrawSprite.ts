import { ImageAsset } from "../Assets";
import { type Color, ColorId, SolidColor, transparent } from "../Color";
import { spr_, Sprite } from "../Sprite";
import { Utils } from "../Utils";
import { Xy, xy_ } from "../Xy";
import { DrawPixel } from "./DrawPixel";

export class DrawSprite {
  readonly #canvasBytes: Uint8ClampedArray;
  readonly #canvasSize: Xy;

  readonly #pixel: DrawPixel;

  constructor(canvasBytes: Uint8ClampedArray, canvasSize: Xy) {
    this.#canvasBytes = canvasBytes;
    this.#canvasSize = canvasSize;

    this.#pixel = new DrawPixel(this.#canvasBytes, this.#canvasSize);
  }

  draw(
    sourceImageAsset: ImageAsset,
    sprite: Sprite,
    targetXy1: Xy,
    colorMapping: Map<ColorId, Color> = new Map(),
  ): void {
    const {
      width: imgW,
      height: imgH,
      rgba8bitData: imgBytes,
    } = sourceImageAsset;

    // make sure xy1 is top-left and xy2 is bottom right
    sprite = spr_(
      Math.min(sprite.xy1.x, sprite.xy2.x),
      Math.min(sprite.xy1.y, sprite.xy2.y),
      Math.max(sprite.xy1.x, sprite.xy2.x),
      Math.max(sprite.xy1.y, sprite.xy2.y),
    );

    // clip sprite by image edges
    sprite = spr_(
      Utils.clamp(0, sprite.xy1.x, imgW),
      Utils.clamp(0, sprite.xy1.y, imgH),
      Utils.clamp(0, sprite.xy2.x, imgW),
      Utils.clamp(0, sprite.xy2.y, imgH),
    );

    for (let imgY = sprite.xy1.y; imgY < sprite.xy2.y; imgY += 1) {
      for (let imgX = sprite.xy1.x; imgX < sprite.xy2.x; imgX += 1) {
        const imgBytesIndex = (imgY * imgW + imgX) * 4;

        if (imgBytes.length < imgBytesIndex + 4) {
          throw Error(
            `DrawSprite: there are less image bytes (${imgBytes.length}) than accessed byte index (${imgBytesIndex})`,
          );
        }
        let color =
          imgBytes[imgBytesIndex + 3]! > 0xff / 2
            ? new SolidColor(
                imgBytes[imgBytesIndex]!,
                imgBytes[imgBytesIndex + 1]!,
                imgBytes[imgBytesIndex + 2]!,
              )
            : transparent;
        color = colorMapping.get(color.id()) ?? color;

        if (color instanceof SolidColor) {
          const canvasXy = targetXy1.add(
            xy_(imgX - sprite.xy1.x, imgY - sprite.xy1.y),
          );
          this.#pixel.draw(canvasXy, color);
        }
      }
    }
  }
}
