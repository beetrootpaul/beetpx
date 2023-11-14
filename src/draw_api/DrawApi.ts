import { BpxUtils } from "../Utils";
import { Assets, FontAsset } from "../assets/Assets";
import { Canvas } from "../canvas/Canvas";
import { BpxCanvasSnapshotColorMapping } from "../color/CanvasSnapshotColorMapping";
import { BpxPatternColors } from "../color/PatternColors";
import { BpxRgbColor } from "../color/RgbColor";
import { BpxSpriteColorMapping } from "../color/SpriteColorMapping";
import { BpxCharSprite, BpxFont, BpxFontId } from "../font/Font";
import { Logger } from "../logger/Logger";
import { BpxVector2d, v_, v_1_1_ } from "../misc/Vector2d";
import { BpxPattern } from "./Pattern";
import { BpxSprite } from "./Sprite";
import { DrawClear } from "./drawing/DrawClear";
import { DrawEllipse } from "./drawing/DrawEllipse";
import { DrawLine } from "./drawing/DrawLine";
import { DrawPixel } from "./drawing/DrawPixel";
import { DrawPixels } from "./drawing/DrawPixels";
import { DrawRect } from "./drawing/DrawRect";
import { DrawSprite } from "./drawing/DrawSprite";
import { DrawText } from "./drawing/DrawText";

type DrawApiOptions = {
  canvas: Canvas;
  assets: Assets;
};

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

  clearCanvas(color: BpxRgbColor): void {
    this.#clear.draw(color);
  }

  setClippingRegion(xy: BpxVector2d, wh: BpxVector2d): void {
    this.#canvas.setClippingRegion(xy, wh);
  }

  // TODO: TEST IT
  removeClippingRegion(): void {
    this.#canvas.removeClippingRegion();
  }

  // TODO: TEST returned value
  // TODO: rename it to setCameraPosition, make it inverted
  setCameraOffset(offset: BpxVector2d): BpxVector2d {
    const prevOffset = this.#cameraOffset;
    this.#cameraOffset = offset;
    return prevOffset;
  }

  // TODO: TEST returned value
  setPattern(pattern: BpxPattern): BpxPattern {
    const prevPattern = this.#pattern;
    this.#pattern = pattern;
    return prevPattern;
  }

  pixel(xy: BpxVector2d, color: BpxRgbColor): void {
    this.#pixel.draw(xy.sub(this.#cameraOffset), color, this.#pattern);
  }

  pixels(xy: BpxVector2d, color: BpxRgbColor, bits: string[]): void {
    this.#pixels.draw(xy.sub(this.#cameraOffset), bits, color, this.#pattern);
  }

  line(
    xy: BpxVector2d,
    wh: BpxVector2d,
    color: BpxRgbColor | BpxPatternColors | BpxCanvasSnapshotColorMapping,
  ): void {
    this.#line.draw(xy.sub(this.#cameraOffset), wh, color, this.#pattern);
  }

  rect(
    xy: BpxVector2d,
    wh: BpxVector2d,
    color: BpxRgbColor | BpxPatternColors | BpxCanvasSnapshotColorMapping,
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
    color: BpxRgbColor | BpxPatternColors | BpxCanvasSnapshotColorMapping,
  ): void {
    this.#rect.draw(xy.sub(this.#cameraOffset), wh, color, true, this.#pattern);
  }

  ellipse(
    xy: BpxVector2d,
    wh: BpxVector2d,
    color: BpxRgbColor | BpxPatternColors | BpxCanvasSnapshotColorMapping,
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
    color: BpxRgbColor | BpxPatternColors | BpxCanvasSnapshotColorMapping,
  ): void {
    this.#ellipse.draw(
      xy.sub(this.#cameraOffset),
      wh,
      color,
      true,
      this.#pattern,
    );
  }

  setSpriteColorMapping(
    spriteColorMapping: BpxSpriteColorMapping,
  ): BpxSpriteColorMapping {
    const prevMapping = this.#spriteColorMapping;
    this.#spriteColorMapping = spriteColorMapping;
    return prevMapping;
  }

  sprite(
    sprite: BpxSprite,
    canvasXy: BpxVector2d,
    // TODO: make it a named option
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

  // TODO: TEST returned value
  setFont(fontId: BpxFontId | null): BpxFontId | null {
    const prevFontId = this.#fontAsset?.font.id ?? null;
    this.#fontAsset = fontId ? this.#assets.getFontAsset(fontId) : null;
    return prevFontId;
  }

  getFont(): BpxFont | null {
    return this.#fontAsset?.font ?? null;
  }

  print(
    text: string,
    canvasXy: BpxVector2d,
    color: BpxRgbColor | ((charSprite: BpxCharSprite) => BpxRgbColor),
    // TODO: make it a named option
    centerXy: [boolean, boolean] = [false, false],
    // TODO: make it a named option
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
        this.#pattern,
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
