import { ImageAsset } from "../Assets";
import { ColorId, SolidColor, transparent_, type Color } from "../Color";
import { Sprite } from "../Sprite";
import { Utils } from "../Utils";
import { Vector2d, v_ } from "../Vector2d";
import { ClippingRegion } from "./ClippingRegion";
import { DrawPixel } from "./DrawPixel";

export class DrawSprite {
  readonly #canvasBytes: Uint8ClampedArray;
  readonly #canvasSize: Vector2d;
  readonly #options: { disableRounding?: boolean };

  readonly #pixel: DrawPixel;

  constructor(
    canvasBytes: Uint8ClampedArray,
    canvasSize: Vector2d,
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
    sprite: Sprite,
    targetXy: Vector2d,
    colorMapping: Map<ColorId, Color> = new Map(),
    clippingRegion: ClippingRegion | null = null,
  ): void {
    targetXy = this.#options.disableRounding ? targetXy : targetXy.round();

    const {
      width: imgW,
      height: imgH,
      rgba8bitData: imgBytes,
    } = sourceImageAsset;

    // make sure xy1 is top-left and xy2 is bottom right
    sprite = new Sprite(
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
    sprite = new Sprite(
      sprite.imageUrl,
      v_(
        Utils.clamp(0, sprite.xy1.x, imgW),
        Utils.clamp(0, sprite.xy1.y, imgH),
      ),
      v_(
        Utils.clamp(0, sprite.xy2.x, imgW),
        Utils.clamp(0, sprite.xy2.y, imgH),
      ),
    );

    for (let imgY = sprite.xy1.y; imgY < sprite.xy2.y; imgY += 1) {
      for (let imgX = sprite.xy1.x; imgX < sprite.xy2.x; imgX += 1) {
        const canvasXy = targetXy.add(
          v_(imgX - sprite.xy1.x, imgY - sprite.xy1.y),
        );
        if (clippingRegion && !clippingRegion.allowsDrawingAt(canvasXy)) {
          continue;
        }

        const imgBytesIndex = (imgY * imgW + imgX) * 4;

        if (imgBytes.length < imgBytesIndex + 4) {
          throw Error(
            `DrawSprite: there are less image bytes (${imgBytes.length}) than accessed byte index (${imgBytesIndex})`,
          );
        }
        let color =
          imgBytes[imgBytesIndex + 3]! >= 0xff / 2
            ? new SolidColor(
                imgBytes[imgBytesIndex]!,
                imgBytes[imgBytesIndex + 1]!,
                imgBytes[imgBytesIndex + 2]!,
              )
            : transparent_;
        color = colorMapping.get(color.id) ?? color;

        // TODO: Investigate why colors recognized by color picked in WebStorm on PNG are different from those drawn:
        //       - ff614f became ff6e59
        //       - 00555a became 125359
        this.#pixel.draw(canvasXy, color);
      }
    }
  }
}
