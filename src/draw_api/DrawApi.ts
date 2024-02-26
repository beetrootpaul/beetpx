import { Assets, FontAsset } from "../assets/Assets";
import { Canvas } from "../canvas/Canvas";
import { BpxCanvasSnapshotColorMapping } from "../color/CanvasSnapshotColorMapping";
import { BpxPatternColors } from "../color/PatternColors";
import { BpxRgbColor } from "../color/RgbColor";
import { BpxSpriteColorMapping } from "../color/SpriteColorMapping";
import { BpxCharSprite, BpxFont, BpxFontId } from "../font/Font";
import { Logger } from "../logger/Logger";
import { BpxVector2d, v_, v_1_1_ } from "../misc/Vector2d";
import { BpxAnimatedSprite } from "../sprite/AnimatedSprite";
import { BpxSprite } from "../sprite/Sprite";
import { BpxUtils } from "../Utils";
import { DrawClear } from "./drawing/DrawClear";
import { DrawEllipse } from "./drawing/DrawEllipse";
import { DrawLine } from "./drawing/DrawLine";
import { DrawPixel } from "./drawing/DrawPixel";
import { DrawPixels } from "./drawing/DrawPixels";
import { DrawRect } from "./drawing/DrawRect";
import { DrawSprite } from "./drawing/DrawSprite";
import { DrawText } from "./drawing/DrawText";
import { BpxDrawingPattern } from "./Pattern";
import { BpxPixels } from "./Pixels";

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

  cameraXy: BpxVector2d = v_(0, 0);
  #pattern: BpxDrawingPattern = BpxDrawingPattern.primaryOnly;

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

  setClippingRegion(
    xy: BpxVector2d,
    wh: BpxVector2d,
  ): [BpxVector2d, BpxVector2d] {
    return this.#canvas.setClippingRegion(xy, wh);
  }

  removeClippingRegion(): [BpxVector2d, BpxVector2d] {
    return this.#canvas.removeClippingRegion();
  }

  setCameraXy(xy: BpxVector2d): BpxVector2d {
    const prev = this.cameraXy;
    this.cameraXy = xy;
    return prev;
  }

  setDrawingPattern(pattern: BpxDrawingPattern): BpxDrawingPattern {
    const prev = this.#pattern;
    this.#pattern = pattern;
    return prev;
  }

  drawPixel(xy: BpxVector2d, color: BpxRgbColor): void {
    this.#pixel.draw(xy.sub(this.cameraXy), color, this.#pattern);
  }

  drawPixels(
    pixels: BpxPixels,
    xy: BpxVector2d,
    color: BpxRgbColor,
    opts: {
      scaleXy?: BpxVector2d;
    } = {},
  ): void {
    this.#pixels.draw(
      pixels,
      xy.sub(this.cameraXy),
      color,
      opts.scaleXy ?? v_1_1_,
      this.#pattern,
    );
  }

  drawLine(
    xy: BpxVector2d,
    wh: BpxVector2d,
    color: BpxRgbColor | BpxPatternColors | BpxCanvasSnapshotColorMapping,
  ): void {
    this.#line.draw(xy.sub(this.cameraXy), wh, color, this.#pattern);
  }

  drawRect(
    xy: BpxVector2d,
    wh: BpxVector2d,
    color: BpxRgbColor | BpxPatternColors | BpxCanvasSnapshotColorMapping,
  ): void {
    this.#rect.draw(xy.sub(this.cameraXy), wh, color, false, this.#pattern);
  }

  drawRectFilled(
    xy: BpxVector2d,
    wh: BpxVector2d,
    color: BpxRgbColor | BpxPatternColors | BpxCanvasSnapshotColorMapping,
  ): void {
    this.#rect.draw(xy.sub(this.cameraXy), wh, color, true, this.#pattern);
  }

  drawEllipse(
    xy: BpxVector2d,
    wh: BpxVector2d,
    color: BpxRgbColor | BpxPatternColors | BpxCanvasSnapshotColorMapping,
  ): void {
    this.#ellipse.draw(xy.sub(this.cameraXy), wh, color, false, this.#pattern);
  }

  drawEllipseFilled(
    xy: BpxVector2d,
    wh: BpxVector2d,
    color: BpxRgbColor | BpxPatternColors | BpxCanvasSnapshotColorMapping,
  ): void {
    this.#ellipse.draw(xy.sub(this.cameraXy), wh, color, true, this.#pattern);
  }

  setSpriteColorMapping(
    spriteColorMapping: BpxSpriteColorMapping,
  ): BpxSpriteColorMapping {
    const prev = this.#spriteColorMapping;
    this.#spriteColorMapping = spriteColorMapping;
    return prev;
  }

  drawSprite(
    sprite: BpxSprite | BpxAnimatedSprite,
    xy: BpxVector2d,
    opts: {
      centerXy?: [boolean, boolean];
      scaleXy?: BpxVector2d;
    } = {},
  ): void {
    const centerXy = opts.centerXy ?? [false, false];
    if (centerXy[0] || centerXy[1]) {
      xy = xy.sub(
        centerXy[0] ? sprite.size.x / 2 : 0,
        centerXy[1] ? sprite.size.y / 2 : 0,
      );
    }

    const sourceImageAsset = this.#assets.getImageAsset(sprite.imageUrl);
    this.#sprite.draw(
      sprite.type === "static" ? sprite : sprite.current,
      sourceImageAsset,
      xy.sub(this.cameraXy),
      opts.scaleXy ?? v_1_1_,
      this.#spriteColorMapping,
      this.#pattern,
    );
  }

  setFont(fontId: BpxFontId | null): BpxFontId | null {
    const prev = this.#fontAsset?.font.id ?? null;
    this.#fontAsset = fontId ? this.#assets.getFontAsset(fontId) : null;
    return prev;
  }

  getFont(): BpxFont | null {
    return this.#fontAsset?.font ?? null;
  }

  drawText(
    text: string,
    xy: BpxVector2d,
    color: BpxRgbColor | ((charSprite: BpxCharSprite) => BpxRgbColor),
    opts: {
      centerXy?: [boolean, boolean];
      scaleXy?: BpxVector2d;
    } = {},
  ): void {
    const centerXy = opts.centerXy ?? [false, false];
    if (centerXy[0] || centerXy[1]) {
      const [_, size] = BpxUtils.measureText(text);
      xy = xy.sub(centerXy[0] ? size.x / 2 : 0, centerXy[1] ? size.y / 2 : 0);
    }
    if (this.#fontAsset) {
      this.#text.draw(
        text,
        this.#fontAsset,
        xy.sub(this.cameraXy),
        color,
        opts.scaleXy ?? v_1_1_,
        this.#pattern,
      );
    } else {
      Logger.infoBeetPx(
        `print: (${xy.x},${xy.y}) [${
          typeof color === "function" ? "computed" : color.cssHex
        }] ${text}`,
      );
    }
  }

  takeCanvasSnapshot(): void {
    return this.#canvas.takeSnapshot();
  }
}
