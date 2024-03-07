import { Assets } from "../assets/Assets";
import { Canvas } from "../canvas/Canvas";
import { BpxCanvasSnapshotColorMapping } from "../color/CanvasSnapshotColorMapping";
import { BpxPatternColors } from "../color/PatternColors";
import { BpxRgbColor } from "../color/RgbColor";
import { BpxSpriteColorMapping } from "../color/SpriteColorMapping";
import { BpxFont, BpxTextColorMarkers } from "../font/Font";
import { BpxVector2d } from "../misc/Vector2d";
import { font_pico8_, rgb_white_, v_, v_1_1_ } from "../shorthands";
import { BpxAnimatedSprite } from "../sprite/AnimatedSprite";
import { BpxSprite } from "../sprite/Sprite";
import { DrawClear } from "./drawing/DrawClear";
import { DrawEllipse } from "./drawing/DrawEllipse";
import { DrawLine } from "./drawing/DrawLine";
import { DrawPixel } from "./drawing/DrawPixel";
import { DrawPixels } from "./drawing/DrawPixels";
import { DrawRect } from "./drawing/DrawRect";
import { DrawSprite } from "./drawing/DrawSprite";
import { DrawText } from "./drawing/DrawText";
import { BpxDrawingPattern } from "./DrawingPattern";
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

  #font: BpxFont = font_pico8_;

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
    this.#text = new DrawText(options.canvas, options.assets);
  }

  clearCanvas(color: BpxRgbColor): void {
    this.#clear.draw(color);
  }

  setClippingRegion(
    xy: BpxVector2d,
    wh: BpxVector2d,
  ): [xy: BpxVector2d, wh: BpxVector2d] {
    return this.#canvas.setClippingRegion(xy, wh);
  }

  removeClippingRegion(): [xy: BpxVector2d, wh: BpxVector2d] {
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
    opts?: {
      scaleXy?: BpxVector2d;
    },
  ): void {
    this.#pixels.draw(
      pixels,
      xy.sub(this.cameraXy),
      color,
      opts?.scaleXy ?? v_1_1_,
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
    opts?: {
      centerXy?: [boolean, boolean];
      scaleXy?: BpxVector2d;
    },
  ): void {
    const centerXy = opts?.centerXy ?? [false, false];
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
      opts?.scaleXy ?? v_1_1_,
      this.#spriteColorMapping,
      this.#pattern,
    );
  }

  useFont(font: BpxFont): void {
    this.#font = font;
  }

  // TODO: move tests here from utils + cover scale and centering
  measureText(
    text: string,
    opts?: { scaleXy?: BpxVector2d; centerXy?: [boolean, boolean] },
  ): { wh: BpxVector2d; offset: BpxVector2d } {
    let maxLineNumber = 0;
    let maxX = 0;

    for (const arrangedGlyph of this.#font.arrangeGlyphsFor(text, rgb_white_)) {
      maxLineNumber = Math.max(maxLineNumber, arrangedGlyph.lineNumber);
      maxX = Math.max(
        maxX,
        arrangedGlyph.leftTop.x +
          (arrangedGlyph.type === "sprite"
            ? arrangedGlyph.sprite.size.x
            : arrangedGlyph.pixels.size.x),
      );
    }

    const wh = v_(
      maxX,
      (maxLineNumber + 1) * (this.#font.ascent + this.#font.descent) +
        maxLineNumber * this.#font.lineGap,
    ).mul(opts?.scaleXy ?? v_1_1_);

    const offset = v_(
      opts?.centerXy?.[0] ? -wh.x / 2 : 0,
      opts?.centerXy?.[1] ? -wh.y / 2 : 0,
    );

    return { wh, offset };
  }

  drawText(
    xy: BpxVector2d,
    color: BpxRgbColor,
    text: string,
    opts?: {
      centerXy?: [boolean, boolean];
      scaleXy?: BpxVector2d;
      // TODO: test it
      colorMarkers?: BpxTextColorMarkers;
    },
  ): void {
    const centerXy = opts?.centerXy ?? [false, false];
    // TODO: test the combination of scale and center vs rounding with a pixel precision instead of rounding before scaling up
    if (centerXy[0] || centerXy[1]) {
      const { offset } = this.measureText(text, {
        scaleXy: opts?.scaleXy,
        centerXy: opts?.centerXy,
      });
      xy = xy.add(offset);
    }
    this.#text.draw(
      text,
      this.#font,
      xy.sub(this.cameraXy),
      color,
      opts?.colorMarkers ?? {},
      opts?.scaleXy ?? v_1_1_,
      this.#pattern,
    );
  }

  takeCanvasSnapshot(): void {
    return this.#canvas.takeSnapshot();
  }
}
