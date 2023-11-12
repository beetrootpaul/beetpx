import { BpxUtils } from "../Utils";
import { Canvas } from "../canvas_pixels/Canvas";
import { ImageAsset } from "../misc/Assets";
import { BpxColorId, BpxSolidColor, BpxTransparentColor } from "../misc/Color";
import { BpxVector2d, v_, v_1_1_ } from "../misc/Vector2d";
import { BpxFillPattern } from "./FillPattern";
import { PreparedSprites } from "./PreparedSprites";
import { BpxSprite } from "./Sprite";

export class DrawSprite {
  static readonly #preparedSprites: PreparedSprites = new PreparedSprites();

  readonly #canvas: Canvas;
  readonly #options: { disableRounding?: boolean };

  constructor(canvas: Canvas, options: { disableRounding?: boolean } = {}) {
    this.#canvas = canvas;
    this.#options = options;
  }

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
  ): void {
    targetXy = this.#options.disableRounding ? targetXy : targetXy.round();

    scaleXy = scaleXy.floor();

    const {
      width: imgW,
      height: imgH,
      channels: imgChannels,
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
      !this.#canvas.canSetAny(
        targetXy.x,
        targetXy.y,
        targetXy.x + sprite.size().x * scaleXy.x - 1,
        targetXy.y + sprite.size().y * scaleXy.y - 1,
      )
    ) {
      return;
    }

    const preparedSprite = DrawSprite.#preparedSprites.prepareOrGetFromCache(
      sprite,
      imgBytes,
      imgW,
      imgChannels,
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

            if (this.#canvas.canSetAt(canvasX, canvasY)) {
              if (fillPattern.hasPrimaryColorAt(canvasX, canvasY)) {
                const color = preparedSprite.colors[spriteX]![spriteY];
                if (color) {
                  this.#canvas.set(color, canvasX, canvasY);
                }
              }
            }
          }
        }
      }
    }
  }
}
