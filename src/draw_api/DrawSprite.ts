import { ImageAsset } from "../Assets";
import {
  BpxColorId,
  BpxSolidColor,
  transparent_,
  type BpxColor,
} from "../Color";
import { BpxSprite } from "../Sprite";
import { BpxUtils, u_ } from "../Utils";
import { BpxVector2d, v_ } from "../Vector2d";
import { BpxClippingRegion } from "./ClippingRegion";
import { DrawPixel } from "./DrawPixel";
import { BpxFillPattern } from "./FillPattern";

export class DrawSprite {
  readonly #canvasBytes: Uint8ClampedArray;
  readonly #canvasSize: BpxVector2d;
  readonly #options: { disableRounding?: boolean };

  readonly #pixel: DrawPixel;

  constructor(
    canvasBytes: Uint8ClampedArray,
    canvasSize: BpxVector2d,
    options: { disableRounding?: boolean } = {},
  ) {
    this.#canvasBytes = canvasBytes;
    this.#canvasSize = canvasSize;
    this.#options = options;

    this.#pixel = new DrawPixel(this.#canvasBytes, this.#canvasSize);
  }

  // TODO: cover clippingRegion with tests
  draw(
    sourceImageAsset: ImageAsset,
    sprite: BpxSprite,
    targetXy: BpxVector2d,
    // TODO: test it
    // TODO: how to express it has to be a non-negative integer? Or maybe it doesn't have to?
    scaleXy: BpxVector2d = BpxVector2d.one,
    colorMapping: Map<BpxColorId, BpxColor> = new Map(),
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

    for (let imgY = sprite.xy1.y; imgY < sprite.xy2.y; imgY += 1) {
      for (let imgX = sprite.xy1.x; imgX < sprite.xy2.x; imgX += 1) {
        u_.range(scaleXy.x).forEach((xScaledStep) => {
          u_.range(scaleXy.y).forEach((yScaledStep) => {
            const canvasXy = targetXy.add(
              v_(imgX - sprite.xy1.x, imgY - sprite.xy1.y)
                .mul(scaleXy)
                .add(xScaledStep, yScaledStep),
            );

            const imgBytesIndex = (imgY * imgW + imgX) * 4;

            if (imgBytes.length < imgBytesIndex + 4) {
              throw Error(
                `DrawSprite: there are less image bytes (${imgBytes.length}) than accessed byte index (${imgBytesIndex})`,
              );
            }
            let color =
              imgBytes[imgBytesIndex + 3]! >= 0xff / 2
                ? new BpxSolidColor(
                    imgBytes[imgBytesIndex]!,
                    imgBytes[imgBytesIndex + 1]!,
                    imgBytes[imgBytesIndex + 2]!,
                  )
                : transparent_;
            color = colorMapping.get(color.id) ?? color;

            // TODO: Investigate why colors recognized by color picked in WebStorm on PNG are different from those drawn:
            //       - ff614f became ff6e59
            //       - 00555a became 125359
            this.#pixel.draw(canvasXy, color, clippingRegion, fillPattern);
          });
        });
      }
    }
  }
}
