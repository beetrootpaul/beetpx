import { Assets, FontAsset } from "../Assets";
import {
  BpxColor,
  BpxColorId,
  BpxCompositeColor,
  BpxMappingColor,
  BpxSolidColor,
  BpxTransparentColor,
} from "../Color";
import { BpxCharSprite, BpxFont, BpxFontId } from "../font/Font";
import { Logger } from "../logger/Logger";
import { BpxSprite } from "../Sprite";
import { BpxUtils } from "../Utils";
import { BpxVector2d, v_ } from "../Vector2d";
import { BpxClippingRegion } from "./ClippingRegion";
import { DrawClear } from "./DrawClear";
import { DrawEllipse } from "./DrawEllipse";
import { DrawLine } from "./DrawLine";
import { DrawPixel } from "./DrawPixel";
import { DrawPixels } from "./DrawPixels";
import { DrawRect } from "./DrawRect";
import { DrawSprite } from "./DrawSprite";
import { DrawText } from "./DrawText";
import { BpxFillPattern } from "./FillPattern";

// TODO: BpxColorMapping and BpxMappingColor are named way too similar, while doing different things!
export type BpxColorMapping = Array<{
  from: BpxSolidColor;
  to: BpxSolidColor | BpxTransparentColor;
}>;

export type BpxCanvasSnapshot = {
  canvasBytes: Uint8ClampedArray;
};

type DrawApiOptions = {
  // TODO: better name to indicate in-out nature of this param? Or some info in JSDoc?
  canvasBytes: Uint8ClampedArray;
  canvasSize: BpxVector2d;
  assets: Assets;
};

// TODO: rework DrawAPI to make it clear which modifiers (pattern, mapping, clip, etc.) affect which operations (line, rect, sprite, etc.)

// TODO: tests for float rounding: different shapes and sprites drawn for same coords should be aligned visually, not off by 1.
//       It's especially about cases where we should round xy+wh instead of xy first and then wh separately.

export class DrawApi {
  readonly #assets: Assets;

  readonly #clear: DrawClear;
  readonly #pixel: DrawPixel;
  readonly #pixels: DrawPixels;
  readonly #line: DrawLine;
  readonly #rect: DrawRect;
  readonly #ellipse: DrawEllipse;
  readonly #sprite: DrawSprite;
  readonly #text: DrawText;

  #cameraOffset: BpxVector2d = v_(0, 0);

  #clippingRegion: BpxClippingRegion | null = null;
  #fillPattern: BpxFillPattern = BpxFillPattern.primaryOnly;

  #fontAsset: FontAsset | null = null;

  readonly #spriteColorMapping: Map<BpxColorId, BpxColor> = new Map();

  readonly takeCanvasSnapshot: () => BpxCanvasSnapshot;

  constructor(options: DrawApiOptions) {
    this.#assets = options.assets;

    this.#clear = new DrawClear(options.canvasBytes, options.canvasSize);
    this.#pixel = new DrawPixel(options.canvasBytes, options.canvasSize);
    this.#pixels = new DrawPixels(options.canvasBytes, options.canvasSize);
    this.#line = new DrawLine(options.canvasBytes, options.canvasSize);
    this.#rect = new DrawRect(options.canvasBytes, options.canvasSize);
    this.#ellipse = new DrawEllipse(options.canvasBytes, options.canvasSize);
    this.#sprite = new DrawSprite(options.canvasBytes, options.canvasSize);
    this.#text = new DrawText(options.canvasBytes, options.canvasSize);

    this.takeCanvasSnapshot = () => ({
      canvasBytes: new Uint8ClampedArray(options.canvasBytes),
    });
  }

  // TODO: cover it with tests, e.g. make sure that fill pattern is applied on a canvas from its left-top in (0,0), no matter what the camera offset is
  // TODO: consider returning the previous offset
  setCameraOffset(offset: BpxVector2d): void {
    this.#cameraOffset = offset;
  }

  setClippingRegion(xy: BpxVector2d, wh: BpxVector2d): void {
    this.#clippingRegion = new BpxClippingRegion(xy, wh);
  }

  removeClippingRegion(): void {
    this.#clippingRegion = null;
  }

  // TODO: rename it? "fill" suggests it would apply to filled shapes only, but we apply it to contours as well
  // TODO: cover it with tests
  setFillPattern(fillPattern: BpxFillPattern): void {
    this.#fillPattern = fillPattern;
  }

  // TODO: ability to remove all mappings
  // TODO: cover it with tests
  mapSpriteColors(mapping: BpxColorMapping): BpxColorMapping {
    const previous: BpxColorMapping = [];
    mapping.forEach(({ from, to }) => {
      previous.push({
        from,
        to: this.#spriteColorMapping.get(from.id) ?? from,
      });
      // TODO: consider writing a custom equality check function
      if (from.id === to.id) {
        this.#spriteColorMapping.delete(from.id);
      } else {
        this.#spriteColorMapping.set(from.id, to);
      }
    });
    return previous;
  }

  // TODO: cover it with tests
  setFont(fontId: BpxFontId | null): void {
    this.#fontAsset = fontId ? this.#assets.getFontAsset(fontId) : null;
  }

  getFont(): BpxFont | null {
    return this.#fontAsset?.font ?? null;
  }

  clearCanvas(color: BpxSolidColor): void {
    this.#clear.draw(color, this.#clippingRegion);
  }

  pixel(xy: BpxVector2d, color: BpxSolidColor): void {
    this.#pixel.draw(xy.sub(this.#cameraOffset), color, this.#clippingRegion);
  }

  // bits = an array representing rows from top to bottom, where each array element
  //        is a text sequence of `0` and `1` to represent drawn and skipped pixels
  //        from left to right.
  pixels(xy: BpxVector2d, color: BpxSolidColor, bits: string[]): void {
    this.#pixels.draw(
      xy.sub(this.#cameraOffset),
      bits,
      color,
      this.#clippingRegion,
    );
  }

  line(
    xy: BpxVector2d,
    wh: BpxVector2d,
    color: BpxSolidColor | BpxCompositeColor | BpxMappingColor,
  ): void {
    this.#line.draw(
      xy.sub(this.#cameraOffset),
      wh,
      color,
      this.#fillPattern,
      this.#clippingRegion,
    );
  }

  rect(
    xy: BpxVector2d,
    wh: BpxVector2d,
    color: BpxSolidColor | BpxCompositeColor | BpxMappingColor,
  ): void {
    this.#rect.draw(
      xy.sub(this.#cameraOffset),
      wh,
      color,
      false,
      this.#fillPattern,
      this.#clippingRegion,
    );
  }

  rectFilled(
    xy: BpxVector2d,
    wh: BpxVector2d,
    color: BpxSolidColor | BpxCompositeColor | BpxMappingColor,
  ): void {
    this.#rect.draw(
      xy.sub(this.#cameraOffset),
      wh,
      color,
      true,
      this.#fillPattern,
      this.#clippingRegion,
    );
  }

  ellipse(
    xy: BpxVector2d,
    wh: BpxVector2d,
    color: BpxSolidColor | BpxCompositeColor | BpxMappingColor,
  ): void {
    this.#ellipse.draw(
      xy.sub(this.#cameraOffset),
      wh,
      color,
      false,
      this.#fillPattern,
      this.#clippingRegion,
    );
  }

  ellipseFilled(
    xy: BpxVector2d,
    wh: BpxVector2d,
    color: BpxSolidColor | BpxCompositeColor | BpxMappingColor,
  ): void {
    this.#ellipse.draw(
      xy.sub(this.#cameraOffset),
      wh,
      color,
      true,
      this.#fillPattern,
      this.#clippingRegion,
    );
  }

  // TODO: make sprite make use of fillPattern as well?
  sprite(
    sprite: BpxSprite,
    canvasXy: BpxVector2d,
    scaleXy: BpxVector2d = BpxVector2d.one,
  ): void {
    const sourceImageAsset = this.#assets.getImageAsset(sprite.imageUrl);
    this.#sprite.draw(
      sourceImageAsset,
      sprite,
      canvasXy.sub(this.#cameraOffset),
      scaleXy,
      this.#spriteColorMapping,
      this.#fillPattern,
      this.#clippingRegion,
    );
  }

  // TODO: cover with tests
  print(
    text: string,
    canvasXy: BpxVector2d,
    color: BpxSolidColor | ((charSprite: BpxCharSprite) => BpxSolidColor),
    centerXy: [boolean, boolean] = [false, false],
  ): void {
    if (centerXy[0] || centerXy[1]) {
      const size = BpxUtils.measureText(text);
      canvasXy = canvasXy.sub(
        centerXy[0] ? size.x / 2 : 0,
        centerXy[1] ? size.y / 2 : 0,
      );
    }
    if (this.#fontAsset) {
      this.#text.draw(
        text,
        canvasXy.sub(this.#cameraOffset),
        this.#fontAsset,
        color,
        this.#clippingRegion,
      );
    } else {
      Logger.infoBeetPx(
        `print: (${canvasXy.x},${canvasXy.y}) [${
          typeof color === "function" ? "computed" : color.asRgbCssHex()
        }] ${text}`,
      );
    }
  }
}
