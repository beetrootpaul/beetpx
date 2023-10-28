import { ImageAsset } from "../Assets";
import {
  BpxColorId,
  BpxSolidColor,
  BpxTransparentColor,
  transparent_,
} from "../Color";
import { BpxSprite } from "../Sprite";
import { BpxUtils } from "../Utils";
import { BpxVector2d, v_, v_1_1_ } from "../Vector2d";
import { CanvasPixels } from "./canvas_pixels/CanvasPixels";
import { BpxClippingRegion } from "./ClippingRegion";
import { BpxFillPattern } from "./FillPattern";

export class DrawSprite {
  readonly #canvasPixels: CanvasPixels;
  readonly #options: { disableRounding?: boolean };

  constructor(
    canvasPixels: CanvasPixels,
    options: { disableRounding?: boolean } = {},
  ) {
    this.#canvasPixels = canvasPixels;
    this.#options = options;
  }

  // TODO: Investigate why colors recognized by color picked in WebStorm on PNG are different from those drawn:
  //       - ff614f became ff6e59
  //       - 00555a became 125359
  // TODO: cover clippingRegion with tests
  draw(
    sourceImageAsset: ImageAsset,
    sprite: BpxSprite,
    targetXy: BpxVector2d,
    // TODO: test it
    // TODO: how to express it has to be a non-negative integer? Or maybe it doesn't have to?
    scaleXy: BpxVector2d = v_1_1_,
    colorMapping: Map<
      BpxColorId,
      BpxSolidColor | BpxTransparentColor
    > = new Map(),
    // TODO: test it
    fillPattern: BpxFillPattern = BpxFillPattern.primaryOnly,
    clippingRegion: BpxClippingRegion | null = null,
  ): void {
    targetXy = this.#options.disableRounding ? targetXy : targetXy.round();

    scaleXy = scaleXy.floor();

    const {
      width: imgW,
      height: imgH,
      rgba8bitData: imgBytes,
    } = sourceImageAsset;

    // make sure xy1 is top-left and xy2 is bottom right
    sprite = new BpxSprite(
      sprite.imageUrl,
      v_(
        Math.min(sprite.xy1.x, sprite.xy2.x),
        Math.min(sprite.xy1.y, sprite.xy2.y),
      ),
      v_(
        Math.max(sprite.xy1.x, sprite.xy2.x),
        Math.max(sprite.xy1.y, sprite.xy2.y),
      ),
    );

    // clip sprite by image edges
    sprite = new BpxSprite(
      sprite.imageUrl,
      v_(
        BpxUtils.clamp(0, sprite.xy1.x, imgW),
        BpxUtils.clamp(0, sprite.xy1.y, imgH),
      ),
      v_(
        BpxUtils.clamp(0, sprite.xy2.x, imgW),
        BpxUtils.clamp(0, sprite.xy2.y, imgH),
      ),
    );

    // avoid all computations if the whole sprite is outside the canvas
    if (
      targetXy.x + sprite.size().x * scaleXy.x < 0 ||
      targetXy.y + sprite.size().y * scaleXy.y < 0 ||
      targetXy.x >= this.#canvasPixels.canvasSize.x ||
      targetXy.y >= this.#canvasPixels.canvasSize.y
    ) {
      return;
    }

    for (let imgY = sprite.xy1.y; imgY < sprite.xy2.y; imgY += 1) {
      const canvasYBase = targetXy.y + (imgY - sprite.xy1.y) * scaleXy.y;
      for (let imgX = sprite.xy1.x; imgX < sprite.xy2.x; imgX += 1) {
        const canvasXBase = targetXy.x + (imgX - sprite.xy1.x) * scaleXy.x;

        for (let xScaledStep = 0; xScaledStep < scaleXy.x; xScaledStep++) {
          for (let yScaledStep = 0; yScaledStep < scaleXy.y; yScaledStep++) {
            const canvasX = canvasXBase + xScaledStep;
            const canvasY = canvasYBase + yScaledStep;

            if (!this.#canvasPixels.wasAlreadySet(canvasX, canvasY)) {
              if (
                !clippingRegion ||
                clippingRegion.allowsDrawingAt(canvasX, canvasY)
              ) {
                if (fillPattern.hasPrimaryColorAt(canvasX, canvasY)) {
                  const imgBytesIndex = (imgY * imgW + imgX) * 4;
                  if (imgBytes.length < imgBytesIndex + 4) {
                    throw Error(
                      `DrawSprite: there are less image bytes (${imgBytes.length}) than accessed byte index (${imgBytesIndex})`,
                    );
                  }

                  const color: BpxSolidColor | BpxTransparentColor =
                    imgBytes[imgBytesIndex + 3]! >= 0xff / 2
                      ? new BpxSolidColor(
                          imgBytes[imgBytesIndex]!,
                          imgBytes[imgBytesIndex + 1]!,
                          imgBytes[imgBytesIndex + 2]!,
                        )
                      : transparent_;
                  const mappedColor = colorMapping.get(color.id) ?? color;

                  if (mappedColor instanceof BpxSolidColor) {
                    this.#canvasPixels.set(mappedColor, canvasX, canvasY);
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
