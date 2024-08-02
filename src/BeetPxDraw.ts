//
// NOTE: Shape of this file and the way things are defined (props vs methods vs static etc.)
//       is carefully picked in order to achieve a given end result in how the docs generated
//       by TypeDoc looks like.
//

import { Engine } from "./Engine";
import { BpxCanvasSnapshotColorMapping } from "./color/CanvasSnapshotColorMapping";
import { BpxPatternColors } from "./color/PatternColors";
import { BpxRgbColor } from "./color/RgbColor";
import { BpxSpriteColorMapping } from "./color/SpriteColorMapping";
import type { BpxTextMeasurement } from "./draw_api/DrawApi";
import { BpxDrawingPattern } from "./draw_api/DrawingPattern";
import { BpxPixels } from "./draw_api/Pixels";
import type { BpxTextColorMarkers } from "./font/Font";
import { BpxFont } from "./font/Font";
import { Logger } from "./logger/Logger";
import { BpxVector2d } from "./misc/Vector2d";
import { BpxAnimatedSprite } from "./sprite/AnimatedSprite";
import { BpxSprite } from "./sprite/Sprite";

/////////////////////////////////////////////////////////////////////////////

/**
 * One of 3 main API entry points. This one provides you with the drawing
 * capabilities. Its methods are supposed to be called from either inside
 * {@link BeetPx.setOnStarted} or {@link BeetPx.setOnDraw} callback.
 *
 * @example
 * ```ts
 * BeetPx.setOnDraw(() => {
 *   BeetPxDraw.rectFilled($v(10), $v(20), $rgb_red);
 * });
 * ```
 *
 * @category API entry points
 */
export class BeetPxDraw {
  private constructor() {}

  static #tryGetEngine(calledFnName: string): Engine {
    if (!Engine.engineSingleton) {
      throw Error(
        `Tried to access BeetPx API without calling BeetPx.start(…) first.`,
      );
    }
    if (!Engine.engineSingleton.isInsideDrawOrStartedCallback) {
      Logger.warnBeetPx(
        `Used "${calledFnName}" outside of either "setOnDraw" or "setOnStarted" callback.`,
      );
    }
    return Engine.engineSingleton;
  }

  /**
   * TODO: docs
   */
  static clearCanvas(color: BpxRgbColor): void {
    BeetPxDraw.#tryGetEngine("clearCanvas").drawApi.clearCanvas(color);
  }

  /**
   * TODO: docs
   *
   * @returns - previous clipping region in form of an array: [xy, wh]
   */
  static setClippingRegion(
    xy: BpxVector2d,
    wh: BpxVector2d,
  ): [xy: BpxVector2d, wh: BpxVector2d] {
    return BeetPxDraw.#tryGetEngine(
      "setClippingRegion",
    ).drawApi.setClippingRegion(xy, wh);
  }

  /**
   * TODO: docs
   *
   * @returns - previous clipping region in form of an array: [xy, wh]
   */
  static removeClippingRegion(): [xy: BpxVector2d, wh: BpxVector2d] {
    return BeetPxDraw.#tryGetEngine(
      "removeClippingRegion",
    ).drawApi.removeClippingRegion();
  }

  /**
   * TODO: docs
   *
   * Sets a new XY (left-top corner) of a camera's viewport
   *
   * @returns previous camera XY
   */
  static setCameraXy(xy: BpxVector2d): BpxVector2d {
    return BeetPxDraw.#tryGetEngine("setCameraXy").drawApi.setCameraXy(xy);
  }

  /**
   * TODO: docs
   *
   * @returns previous pattern
   */
  static setDrawingPattern(pattern: BpxDrawingPattern): BpxDrawingPattern {
    return BeetPxDraw.#tryGetEngine(
      "setDrawingPattern",
    ).drawApi.setDrawingPattern(pattern);
  }

  /**
   * TODO: docs
   */
  static pixel(xy: BpxVector2d, color: BpxRgbColor): void {
    BeetPxDraw.#tryGetEngine("pixel").drawApi.drawPixel(xy, color);
  }

  /**
   * TODO: docs
   *
   * Draws pixels based on a visual 2d representation in form of rows
   *   (designated by new lines) where `#` and `-` stand for a colored
   *   pixel and a lack of a pixel. Whitespaces are ignored.
   */
  static pixels(
    pixels: BpxPixels,
    xy: BpxVector2d,
    color: BpxRgbColor,
    opts?: {
      centerXy?: [boolean, boolean];
      scaleXy?: BpxVector2d;
      flipXy?: [boolean, boolean];
    },
  ): void {
    BeetPxDraw.#tryGetEngine("pixels").drawApi.drawPixels(
      pixels,
      xy,
      color,
      opts,
    );
  }

  /**
   * TODO: docs
   */
  static line(
    xy: BpxVector2d,
    wh: BpxVector2d,
    color: BpxRgbColor | BpxPatternColors | BpxCanvasSnapshotColorMapping,
  ): void {
    BeetPxDraw.#tryGetEngine("line").drawApi.drawLine(xy, wh, color);
  }

  /**
   * TODO: docs
   */
  static rect(
    xy: BpxVector2d,
    wh: BpxVector2d,
    color: BpxRgbColor | BpxPatternColors | BpxCanvasSnapshotColorMapping,
  ): void {
    BeetPxDraw.#tryGetEngine("rect").drawApi.drawRect(xy, wh, color);
  }

  /**
   * TODO: docs
   */
  static rectFilled(
    xy: BpxVector2d,
    wh: BpxVector2d,
    color: BpxRgbColor | BpxPatternColors | BpxCanvasSnapshotColorMapping,
  ): void {
    BeetPxDraw.#tryGetEngine("rectFilled").drawApi.drawRectFilled(
      xy,
      wh,
      color,
    );
  }

  /**
   * TODO: docs
   */
  static rectOutsideFilled(
    xy: BpxVector2d,
    wh: BpxVector2d,
    color: BpxRgbColor | BpxPatternColors | BpxCanvasSnapshotColorMapping,
  ): void {
    BeetPxDraw.#tryGetEngine("rectOutsideFilled").drawApi.drawRectOutsideFilled(
      xy,
      wh,
      color,
    );
  }

  /**
   * TODO: docs
   */
  static ellipse(
    xy: BpxVector2d,
    wh: BpxVector2d,
    color: BpxRgbColor | BpxPatternColors | BpxCanvasSnapshotColorMapping,
  ): void {
    BeetPxDraw.#tryGetEngine("ellipse").drawApi.drawEllipse(xy, wh, color);
  }

  /**
   * TODO: docs
   */
  static ellipseFilled(
    xy: BpxVector2d,
    wh: BpxVector2d,
    color: BpxRgbColor | BpxPatternColors | BpxCanvasSnapshotColorMapping,
  ): void {
    BeetPxDraw.#tryGetEngine("ellipseFilled").drawApi.drawEllipseFilled(
      xy,
      wh,
      color,
    );
  }

  /**
   * TODO: docs
   */
  static ellipseOutsideFilled(
    xy: BpxVector2d,
    wh: BpxVector2d,
    color: BpxRgbColor | BpxPatternColors | BpxCanvasSnapshotColorMapping,
  ): void {
    BeetPxDraw.#tryGetEngine(
      "ellipseOutsideFilled",
    ).drawApi.drawEllipseOutsideFilled(xy, wh, color);
  }

  /**
   * TODO: docs
   *
   * @returns previous sprite color mapping
   */
  static setSpriteColorMapping(
    spriteColorMapping: BpxSpriteColorMapping,
  ): BpxSpriteColorMapping {
    return BeetPxDraw.#tryGetEngine(
      "setSpriteColorMapping",
    ).drawApi.setSpriteColorMapping(spriteColorMapping);
  }

  /**
   * TODO: docs
   */
  static sprite(
    sprite: BpxSprite | BpxAnimatedSprite,
    xy: BpxVector2d,
    opts?: {
      centerXy?: [boolean, boolean];
      scaleXy?: BpxVector2d;
      flipXy?: [boolean, boolean];
    },
  ): void {
    BeetPxDraw.#tryGetEngine("sprite").drawApi.drawSprite(sprite, xy, opts);
  }

  /**
   * TODO: docs
   *
   * @categoryTODO Fonts
   * @returns - previously used font
   */
  static setFont(font: BpxFont): BpxFont {
    return BeetPxDraw.#tryGetEngine("setFont").drawApi.setFont(font);
  }

  /**
   * TODO: docs
   *
   * @returns - previously used color markers
   */
  static setTextColorMarkers(
    textColorMarkers: BpxTextColorMarkers,
  ): BpxTextColorMarkers {
    return BeetPxDraw.#tryGetEngine(
      "setTextColorMarkers",
    ).drawApi.setTextColorMarkers(textColorMarkers);
  }

  /**
   * TODO: docs
   */
  static measureText(
    text: string,
    opts?: {
      centerXy?: [boolean, boolean];
      scaleXy?: BpxVector2d;
    },
  ): BpxTextMeasurement {
    return BeetPxDraw.#tryGetEngine("measureText").drawApi.measureText(
      text,
      opts,
    );
  }

  /**
   * TODO: docs
   */
  static text(
    text: string,
    xy: BpxVector2d,
    color: BpxRgbColor,
    opts?: {
      centerXy?: [boolean, boolean];
      scaleXy?: BpxVector2d;
    },
  ): void {
    BeetPxDraw.#tryGetEngine("text").drawApi.drawText(text, xy, color, opts);
  }

  /**
   * TODO: docs
   */
  static takeCanvasSnapshot(): void {
    BeetPxDraw.#tryGetEngine("takeCanvasSnapshot").drawApi.takeCanvasSnapshot();
  }
}

/////////////////////////////////////////////////////////////////////////////

/**
 * A shorthand for {@link BeetPxDraw}.
 *
 * @category API entry points
 */
export const $d = BeetPxDraw;

/////////////////////////////////////////////////////////////////////////////
