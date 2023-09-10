import { Assets, FontAsset } from "../Assets";
import {
  Color,
  ColorId,
  CompositeColor,
  MappingColor,
  SolidColor,
  TransparentColor,
} from "../Color";
import { CharSprite, Font, FontId } from "../font/Font";
import { Logger } from "../logger/Logger";
import { Sprite } from "../Sprite";
import { v_, Vector2d } from "../Vector2d";
import { ClippingRegion } from "./ClippingRegion";
import { DrawClear } from "./DrawClear";
import { DrawEllipse } from "./DrawEllipse";
import { DrawLine } from "./DrawLine";
import { DrawPixel } from "./DrawPixel";
import { DrawRect } from "./DrawRect";
import { DrawSprite } from "./DrawSprite";
import { DrawText } from "./DrawText";
import { FillPattern } from "./FillPattern";

export type ColorMapping = Array<{
  from: SolidColor;
  to: SolidColor | TransparentColor;
}>;

type DrawApiOptions = {
  // TODO: better name to indicate in-out nature of this param? Or some info in JSDoc?
  canvasBytes: Uint8ClampedArray;
  canvasSize: Vector2d;
  assets: Assets;
};

// TODO: rework DrawAPI to make it clear which modifiers (pattern, mapping, clip, etc.) affect which operations (line, rect, sprite, etc.)

// TODO: tests for float rounding: different shapes and sprites drawn for same coords should be aligned visually, not off by 1.
//       It's especially about cases where we should round xy+wh instead of xy first and then wh separately.

export class DrawApi {
  readonly #assets: Assets;

  readonly #clear: DrawClear;
  readonly #pixel: DrawPixel;
  readonly #line: DrawLine;
  readonly #rect: DrawRect;
  readonly #ellipse: DrawEllipse;
  readonly #sprite: DrawSprite;
  readonly #text: DrawText;

  #cameraOffset: Vector2d = v_(0, 0);

  #clippingRegion: ClippingRegion | null = null;

  #fillPattern: FillPattern = FillPattern.primaryOnly;

  #fontAsset: FontAsset | null = null;

  readonly #spriteColorMapping: Map<ColorId, Color> = new Map();

  constructor(options: DrawApiOptions) {
    this.#assets = options.assets;

    this.#clear = new DrawClear(options.canvasBytes, options.canvasSize);
    this.#pixel = new DrawPixel(options.canvasBytes, options.canvasSize);
    this.#line = new DrawLine(options.canvasBytes, options.canvasSize);
    this.#rect = new DrawRect(options.canvasBytes, options.canvasSize);
    this.#ellipse = new DrawEllipse(options.canvasBytes, options.canvasSize);
    this.#sprite = new DrawSprite(options.canvasBytes, options.canvasSize);
    this.#text = new DrawText(options.canvasBytes, options.canvasSize);
  }

  // TODO: cover it with tests, e.g. make sure that fill pattern is applied on a canvas from its left-top in (0,0), no matter what the camera offset is
  // TODO: consider returning the previous offset
  setCameraOffset(offset: Vector2d): void {
    this.#cameraOffset = offset;
  }

  setClippingRegion(xy: Vector2d, wh: Vector2d): void {
    this.#clippingRegion = new ClippingRegion(xy, wh);
  }

  removeClippingRegion(): void {
    this.#clippingRegion = null;
  }

  // TODO: rename it? "fill" suggests it would apply to filled shapes only, but we apply it to contours as well
  // TODO: cover it with tests
  setFillPattern(fillPattern: FillPattern): void {
    this.#fillPattern = fillPattern;
  }

  // TODO: ability to remove all mappings
  // TODO: cover it with tests
  mapSpriteColors(mapping: ColorMapping): ColorMapping {
    const previous: ColorMapping = [];
    mapping.forEach(({ from, to }) => {
      previous.push({
        from,
        to: this.#spriteColorMapping.get(from.id()) ?? from,
      });
      // TODO: consider writing a custom equality check function
      if (from.id() === to.id()) {
        this.#spriteColorMapping.delete(from.id());
      } else {
        this.#spriteColorMapping.set(from.id(), to);
      }
    });
    return previous;
  }

  // TODO: cover it with tests
  setFont(fontId: FontId | null): void {
    this.#fontAsset = fontId ? this.#assets.getFontAsset(fontId) : null;
  }

  getFont(): Font | null {
    return this.#fontAsset?.font ?? null;
  }

  clearCanvas(color: SolidColor): void {
    this.#clear.draw(color, this.#clippingRegion);
  }

  pixel(xy: Vector2d, color: SolidColor): void {
    this.#pixel.draw(xy.sub(this.#cameraOffset), color, this.#clippingRegion);
  }

  line(
    xy: Vector2d,
    wh: Vector2d,
    color: SolidColor | CompositeColor | MappingColor,
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
    xy: Vector2d,
    wh: Vector2d,
    color: SolidColor | CompositeColor | MappingColor,
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
    xy: Vector2d,
    wh: Vector2d,
    color: SolidColor | CompositeColor | MappingColor,
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
    xy: Vector2d,
    wh: Vector2d,
    color: SolidColor | CompositeColor | MappingColor,
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
    xy: Vector2d,
    wh: Vector2d,
    color: SolidColor | CompositeColor | MappingColor,
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
  sprite(sprite: Sprite, canvasXy: Vector2d): void {
    const sourceImageAsset = this.#assets.getImageAsset(sprite.imageUrl);
    this.#sprite.draw(
      sourceImageAsset,
      sprite,
      canvasXy.sub(this.#cameraOffset),
      this.#spriteColorMapping,
      this.#clippingRegion,
    );
  }

  // TODO: cover with tests
  print(
    text: string,
    canvasXy: Vector2d,
    color: SolidColor | ((charSprite: CharSprite) => SolidColor),
  ): void {
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
