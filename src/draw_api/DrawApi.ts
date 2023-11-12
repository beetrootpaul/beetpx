import { BpxUtils } from "../Utils";
import { Canvas } from "../canvas_pixels/Canvas";
import { BpxCanvasSnapshotColorMapping } from "../color/CanvasSnapshotColorMapping";
import { BpxCompositeColor } from "../color/CompositeColor";
import { BpxRgbColor } from "../color/RgbColor";
import { BpxSpriteColorMapping } from "../color/SpriteColorMapping";
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
import { BpxPattern } from "./Pattern";
import { BpxSprite } from "./Sprite";

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

  #pattern: BpxPattern = BpxPattern.primaryOnly;

  #spriteColorMapping: BpxSpriteColorMapping = BpxSpriteColorMapping.noMapping;

  #fontAsset: FontAsset | null = null;

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

  // TODO: cover it with tests, e.g. make sure that pattern is applied on a canvas from its left-top in (0,0), no matter what the camera offset is
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

  // TODO: cover it with tests
  setPattern(pattern: BpxPattern): void {
    this.#pattern = pattern;
  }

  setSpriteColorMapping(
    spriteColorMapping: BpxSpriteColorMapping,
  ): BpxSpriteColorMapping {
    const prevMapping = this.#spriteColorMapping;
    this.#spriteColorMapping = spriteColorMapping;
    return prevMapping;
  }

  clearCanvas(color: BpxRgbColor): void {
    this.#clear.draw(color);
  }

  pixel(xy: BpxVector2d, color: BpxRgbColor): void {
    this.#pixel.draw(xy.sub(this.#cameraOffset), color, BpxPattern.primaryOnly);
  }

  // bits = an array representing rows from top to bottom, where each array element
  //        is a text sequence of `0` and `1` to represent drawn and skipped pixels
  //        from left to right.
  pixels(xy: BpxVector2d, color: BpxRgbColor, bits: string[]): void {
    this.#pixels.draw(xy.sub(this.#cameraOffset), bits, color);
  }

  line(
    xy: BpxVector2d,
    wh: BpxVector2d,
    color: BpxRgbColor | BpxCompositeColor | BpxCanvasSnapshotColorMapping,
  ): void {
    this.#line.draw(xy.sub(this.#cameraOffset), wh, color, this.#pattern);
  }

  rect(
    xy: BpxVector2d,
    wh: BpxVector2d,
    color: BpxRgbColor | BpxCompositeColor | BpxCanvasSnapshotColorMapping,
  ): void {
    this.#rect.draw(
      xy.sub(this.#cameraOffset),
      wh,
      color,
      false,
      this.#pattern,
    );
  }

  rectFilled(
    xy: BpxVector2d,
    wh: BpxVector2d,
    color: BpxRgbColor | BpxCompositeColor | BpxCanvasSnapshotColorMapping,
  ): void {
    this.#rect.draw(xy.sub(this.#cameraOffset), wh, color, true, this.#pattern);
  }

  ellipse(
    xy: BpxVector2d,
    wh: BpxVector2d,
    color: BpxRgbColor | BpxCompositeColor | BpxCanvasSnapshotColorMapping,
  ): void {
    this.#ellipse.draw(
      xy.sub(this.#cameraOffset),
      wh,
      color,
      false,
      this.#pattern,
    );
  }

  ellipseFilled(
    xy: BpxVector2d,
    wh: BpxVector2d,
    color: BpxRgbColor | BpxCompositeColor | BpxCanvasSnapshotColorMapping,
  ): void {
    this.#ellipse.draw(
      xy.sub(this.#cameraOffset),
      wh,
      color,
      true,
      this.#pattern,
    );
  }

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
      this.#pattern,
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
    color: BpxRgbColor | ((charSprite: BpxCharSprite) => BpxRgbColor),
    centerXy: [boolean, boolean] = [false, false],
    // TODO: how to express it has to be a non-negative integer? Or maybe it doesn't have to?
    scaleXy: BpxVector2d = v_1_1_,
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
        scaleXy,
      );
    } else {
      Logger.infoBeetPx(
        `print: (${canvasXy.x},${canvasXy.y}) [${
          typeof color === "function" ? "computed" : color.cssHex
        }] ${text}`,
      );
    }
  }

  takeCanvasSnapshot(): void {
    return this.#canvas.takeSnapshot();
  }
}
