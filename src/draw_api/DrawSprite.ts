import { ImageAsset } from "../Assets";
import {
  BpxColorId,
  BpxSolidColor,
  transparent_,
  type BpxColor,
} from "../Color";
import { BpxSprite } from "../Sprite";
import { BpxUtils } from "../Utils";
import { BpxVector2d, v2d_, v_ } from "../Vector2d";
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
    scaleXy: BpxVector2d = [1, 1],
    colorMapping: Map<BpxColorId, BpxColor> = new Map(),
    // TODO: test it
    fillPattern: BpxFillPattern = BpxFillPattern.primaryOnly,
    clippingRegion: BpxClippingRegion | null = null,
  ): void {
    targetXy = this.#options.disableRounding ? targetXy : v_.round(targetXy);

    scaleXy = v_.floor(scaleXy);

    const {
      width: imgW,
      height: imgH,
      rgba8bitData: imgBytes,
    } = sourceImageAsset;

    // make sure xy1 is top-left and xy2 is bottom right
    sprite = new BpxSprite(
      sprite.imageUrl,
      v2d_(
        Math.min(sprite.xy1[0], sprite.xy2[0]),
        Math.min(sprite.xy1[1], sprite.xy2[1]),
      ),
      v2d_(
        Math.max(sprite.xy1[0], sprite.xy2[0]),
        Math.max(sprite.xy1[1], sprite.xy2[1]),
      ),
    );

    // clip sprite by image edges
    sprite = new BpxSprite(
      sprite.imageUrl,
      v2d_(
        BpxUtils.clamp(0, sprite.xy1[0], imgW),
        BpxUtils.clamp(0, sprite.xy1[1], imgH),
      ),
      v2d_(
        BpxUtils.clamp(0, sprite.xy2[0], imgW),
        BpxUtils.clamp(0, sprite.xy2[1], imgH),
      ),
    );

    for (let imgY = sprite.xy1[1]; imgY < sprite.xy2[1]; imgY += 1) {
      for (let imgX = sprite.xy1[0]; imgX < sprite.xy2[0]; imgX += 1) {
        BpxUtils.repeatN(scaleXy[0], (xScaledStep) => {
          BpxUtils.repeatN(scaleXy[1], (yScaledStep) => {
            const canvasXy = v_.add(
              targetXy,
              v_.add(
                v_.mul(
                  v2d_(imgX - sprite.xy1[0], imgY - sprite.xy1[1]),
                  scaleXy,
                ),
                v2d_(xScaledStep, yScaledStep),
              ),
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
