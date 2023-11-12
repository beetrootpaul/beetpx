import { BpxUtils } from "../Utils";
import { Canvas } from "../canvas_pixels/Canvas";
import { BpxCanvasSnapshotColorMapping } from "../color/CanvasSnapshotColorMapping";
import { BpxColorId } from "../color/Color";
import { BpxCompositeColor } from "../color/CompositeColor";
import { BpxSolidColor } from "../color/SolidColor";
import { BpxTransparentColor } from "../color/TransparentColor";
import { BpxCharSprite, BpxFont, BpxFontId } from "../font/Font";
import { Logger } from "../logger/Logger";
import { Assets, FontAsset } from "../misc/Assets";
import { BpxVector2d, v_, v_1_1_ } from "../misc/Vector2d";
import { DrawClear } from "./DrawClear";
import { DrawEllipse } from "./DrawEllipse";
import { DrawLine } from "./DrawLine";
import { DrawPixel } from "./DrawPixel";
import { DrawPixels } from "./DrawPixels";
import { DrawRect } from "./DrawRect";
import { DrawSprite } from "./DrawSprite";
import { DrawText } from "./DrawText";
import { BpxFillPattern } from "./FillPattern";
import { BpxSprite } from "./Sprite";

// TODO: BpxColorMapping and BpxMappingColor are named way too similar, while doing different things!
export type BpxColorMapping = Array<{
  from: BpxSolidColor;
  to: BpxSolidColor | BpxTransparentColor;
}>;

type DrawApiOptions = {
  canvas: Canvas;
  assets: Assets;
};

// TODO: rework DrawAPI to make it clear which modifiers (pattern, mapping, clip, etc.) affect which operations (line, rect, sprite, etc.)

// TODO: tests for float rounding: different shapes and sprites drawn for same coords should be aligned visually, not off by 1.
//       It's especially about cases where we should round xy+wh instead of xy first and then wh separately.

export class DrawApi {
  readonly #assets: Assets;

  readonly #canvas: Canvas;

  readonly #clear: DrawClear;
  readonly #pixel: DrawPixel;
  readonly #pixels: DrawPixels;
  readonly #line: DrawLine;
  readonly #rect: DrawRect;
  readonly #ellipse: DrawEllipse;
  readonly #sprite: DrawSprite;
  readonly #text: DrawText;

  #cameraOffset: BpxVector2d = v_(0, 0);

  #fillPattern: BpxFillPattern = BpxFillPattern.primaryOnly;

  #fontAsset: FontAsset | null = null;

  readonly #spriteColorMapping: Map<
    BpxColorId,
    BpxSolidColor | BpxTransparentColor
  > = new Map();

  constructor(options: DrawApiOptions) {
    this.#assets = options.assets;

    this.#canvas = options.canvas;

    this.#clear = new DrawClear(options.canvas);
    this.#pixel = new DrawPixel(options.canvas);
    this.#pixels = new DrawPixels(options.canvas);
    this.#line = new DrawLine(options.canvas);
    this.#rect = new DrawRect(options.canvas);
    this.#ellipse = new DrawEllipse(options.canvas);
    this.#sprite = new DrawSprite(options.canvas);
    this.#text = new DrawText(options.canvas);
  }

  // TODO: cover it with tests, e.g. make sure that fill pattern is applied on a canvas from its left-top in (0,0), no matter what the camera offset is
  // TODO: consider returning the previous offset
  setCameraOffset(offset: BpxVector2d): void {
    this.#cameraOffset = offset;
  }

  setClippingRegion(xy: BpxVector2d, wh: BpxVector2d): void {
    this.#canvas.setClippingRegion(xy, wh);
  }

  removeClippingRegion(): void {
    this.#canvas.removeClippingRegion();
  }

  // TODO: rename it? "fill" suggests it would apply to filled shapes only, but we apply it to contours as well
  // TODO: cover it with tests
  setFillPattern(fillPattern: BpxFillPattern): void {
    this.#fillPattern = fillPattern;
  }

  // TODO: rename to `setSpriteColorMapping`?
  // TODO: make it more clear this fn is additive and `mapSpriteColor([])` does NOT reset the current mapping
  // TODO: super confusing: 1) prevMapping = mapSpriteColors(…) 2) mapSpriteColors(other) 3) mapSpriteColors(prevMapping) DOES NOT reset 2nd call
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
      // TODO: or remove "id" at all if possible?
      if (from.id === to.id) {
        this.#spriteColorMapping.delete(from.id);
      } else {
        this.#spriteColorMapping.set(from.id, to);
      }
    });
    return previous;
  }

  clearCanvas(color: BpxSolidColor): void {
    this.#clear.draw(color);
  }

  pixel(xy: BpxVector2d, color: BpxSolidColor): void {
    this.#pixel.draw(
      xy.sub(this.#cameraOffset),
      color,
      BpxFillPattern.primaryOnly,
    );
  }

  // bits = an array representing rows from top to bottom, where each array element
  //        is a text sequence of `0` and `1` to represent drawn and skipped pixels
  //        from left to right.
  pixels(xy: BpxVector2d, color: BpxSolidColor, bits: string[]): void {
    this.#pixels.draw(xy.sub(this.#cameraOffset), bits, color);
  }

  line(
    xy: BpxVector2d,
    wh: BpxVector2d,
    color: BpxSolidColor | BpxCompositeColor | BpxCanvasSnapshotColorMapping,
  ): void {
    this.#line.draw(xy.sub(this.#cameraOffset), wh, color, this.#fillPattern);
  }

  rect(
    xy: BpxVector2d,
    wh: BpxVector2d,
    color: BpxSolidColor | BpxCompositeColor | BpxCanvasSnapshotColorMapping,
  ): void {
    this.#rect.draw(
      xy.sub(this.#cameraOffset),
      wh,
      color,
      false,
      this.#fillPattern,
    );
  }

  rectFilled(
    xy: BpxVector2d,
    wh: BpxVector2d,
    color: BpxSolidColor | BpxCompositeColor | BpxCanvasSnapshotColorMapping,
  ): void {
    this.#rect.draw(
      xy.sub(this.#cameraOffset),
      wh,
      color,
      true,
      this.#fillPattern,
    );
  }

  ellipse(
    xy: BpxVector2d,
    wh: BpxVector2d,
    color: BpxSolidColor | BpxCompositeColor | BpxCanvasSnapshotColorMapping,
  ): void {
    this.#ellipse.draw(
      xy.sub(this.#cameraOffset),
      wh,
      color,
      false,
      this.#fillPattern,
    );
  }

  ellipseFilled(
    xy: BpxVector2d,
    wh: BpxVector2d,
    color: BpxSolidColor | BpxCompositeColor | BpxCanvasSnapshotColorMapping,
  ): void {
    this.#ellipse.draw(
      xy.sub(this.#cameraOffset),
      wh,
      color,
      true,
      this.#fillPattern,
    );
  }

  // TODO: make sprite make use of fillPattern as well?
  sprite(
    sprite: BpxSprite,
    canvasXy: BpxVector2d,
    // TODO: how to express it has to be a non-negative integer? Or maybe it doesn't have to?
    scaleXy: BpxVector2d = v_1_1_,
  ): void {
    const sourceImageAsset = this.#assets.getImageAsset(sprite.imageUrl);
    this.#sprite.draw(
      sourceImageAsset,
      sprite,
      canvasXy.sub(this.#cameraOffset),
      scaleXy,
      this.#spriteColorMapping,
      this.#fillPattern,
    );
  }

  // TODO: cover it with tests
  setFont(fontId: BpxFontId | null): void {
    this.#fontAsset = fontId ? this.#assets.getFontAsset(fontId) : null;
  }

  getFont(): BpxFont | null {
    return this.#fontAsset?.font ?? null;
  }

  // TODO: cover with tests
  print(
    text: string,
    canvasXy: BpxVector2d,
    color: BpxSolidColor | ((charSprite: BpxCharSprite) => BpxSolidColor),
    centerXy: [boolean, boolean] = [false, false],
    // TODO: how to express it has to be a non-negative integer? Or maybe it doesn't have to?
    // TODO: introduce scaleXy + cover it with tests
    // scaleXy: BpxVector2d = v_1_1_,
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
      );
    } else {
      Logger.infoBeetPx(
        `print: (${canvasXy.x},${canvasXy.y}) [${
          typeof color === "function" ? "computed" : color.asRgbCssHex()
        }] ${text}`,
      );
    }
  }

  takeCanvasSnapshot(): void {
    return this.#canvas.takeSnapshot();
  }
}
