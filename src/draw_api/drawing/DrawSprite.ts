import { ImageAsset } from "../../assets/Assets";
import { Canvas } from "../../canvas/Canvas";
import { BpxSpriteColorMapping } from "../../color/SpriteColorMapping";
import { BpxVector2d, v_, v_0_0_ } from "../../misc/Vector2d";
import { BpxSprite } from "../../sprite/Sprite";
import { BpxDrawingPattern } from "../Pattern";
import { PreparedSprites } from "../PreparedSprites";

export class DrawSprite {
  readonly #preparedSprites: PreparedSprites = new PreparedSprites();

  readonly #canvas: Canvas;
  readonly #options: { disableRounding?: boolean };

  constructor(canvas: Canvas, options: { disableRounding?: boolean } = {}) {
    this.#canvas = canvas;
    this.#options = options;
  }

  draw(
    sprite: BpxSprite,
    sourceImageAsset: ImageAsset,
    targetXy: BpxVector2d,
    scaleXy: BpxVector2d,
    colorMapping: BpxSpriteColorMapping,
    pattern: BpxDrawingPattern,
  ): void {
    targetXy = this.#options.disableRounding ? targetXy : targetXy.round();
    scaleXy = BpxVector2d.max(scaleXy.floor(), v_0_0_);

    const {
      width: imgW,
      height: imgH,
      channels: imgChannels,
      rgba8bitData: imgBytes,
    } = sourceImageAsset;

    sprite = sprite.clipBy(v_0_0_, v_(imgW, imgH));

    // avoid all computations if the whole sprite is outside the canvas
    if (
      !this.#canvas.canSetAny(
        targetXy.x,
        targetXy.y,
        targetXy.x + sprite.size.x * scaleXy.x - 1,
        targetXy.y + sprite.size.y * scaleXy.y - 1,
      )
    ) {
      return;
    }

    const preparedSprite = this.#preparedSprites.prepareOrGetFromCache(
      sprite,
      imgBytes,
      imgW,
      imgChannels,
    );

    for (let spriteY = 0; spriteY < preparedSprite.h; spriteY += 1) {
      const canvasYBase = targetXy.y + spriteY * scaleXy.y;
      for (let spriteX = 0; spriteX < preparedSprite.w; spriteX += 1) {
        const canvasXBase = targetXy.x + spriteX * scaleXy.x;

        for (let yScaledStep = 0; yScaledStep < scaleXy.y; ++yScaledStep) {
          for (let xScaledStep = 0; xScaledStep < scaleXy.x; ++xScaledStep) {
            const canvasX = canvasXBase + xScaledStep;
            const canvasY = canvasYBase + yScaledStep;

            if (this.#canvas.canSetAt(canvasX, canvasY)) {
              if (pattern.hasPrimaryColorAt(canvasX, canvasY)) {
                const color = preparedSprite.colors[spriteX]![spriteY];
                if (color) {
                  const mappedColor = colorMapping.getMappedColor(color);
                  if (mappedColor) {
                    this.#canvas.set(mappedColor, canvasX, canvasY);
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
