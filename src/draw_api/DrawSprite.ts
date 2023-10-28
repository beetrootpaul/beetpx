import { ImageAsset } from "../Assets";
import { BpxColorId, BpxSolidColor, BpxTransparentColor } from "../Color";
import { BpxSprite } from "../Sprite";
import { BpxUtils } from "../Utils";
import { BpxVector2d, v_, v_1_1_ } from "../Vector2d";
import { CanvasPixels } from "./canvas_pixels/CanvasPixels";
import { BpxClippingRegion } from "./ClippingRegion";
import { BpxFillPattern } from "./FillPattern";
import { PreparedSprites } from "./PreparedSprites";

export class DrawSprite {
  static readonly #preparedSprites: PreparedSprites = new PreparedSprites();

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

    const preparedSprite = DrawSprite.#preparedSprites.prepareOrGetFromCache(
      sprite,
      imgBytes,
      imgW,
      colorMapping,
    );

    for (let spriteY = 0; spriteY < preparedSprite.h; spriteY += 1) {
      const canvasYBase = targetXy.y + spriteY * scaleXy.y;
      for (let spriteX = 0; spriteX < preparedSprite.w; spriteX += 1) {
        const canvasXBase = targetXy.x + spriteX * scaleXy.x;

        for (let xScaledStep = 0; xScaledStep < scaleXy.x; ++xScaledStep) {
          for (let yScaledStep = 0; yScaledStep < scaleXy.y; ++yScaledStep) {
            const canvasX = canvasXBase + xScaledStep;
            const canvasY = canvasYBase + yScaledStep;

            if (this.#canvasPixels.canSetAt(canvasX, canvasY)) {
              if (
                !clippingRegion ||
                clippingRegion.allowsDrawingAt(canvasX, canvasY)
              ) {
                if (fillPattern.hasPrimaryColorAt(canvasX, canvasY)) {
                  const color = preparedSprite.colors[spriteX]![spriteY];
                  if (color) {
                    this.#canvasPixels.set(color, canvasX, canvasY);
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
