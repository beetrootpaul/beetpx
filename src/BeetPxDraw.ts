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
   * Fill the entire canvas with a given color. It's a method which you would typically
   * call as the very first inside {@link BeetPx.setOnDraw} in order to not clear the canvas
   * from what was drawn in the previous game loop iteration.
   *
   * @category General
   */
  static clearCanvas(color: BpxRgbColor): void {
    BeetPxDraw.#tryGetEngine("clearCanvas").drawApi.clearCanvas(color);
  }

  /**
   * Sets a clipping region, which is a rectangular boundary which limits all the subsequent drawing
   * to happen only within it.
   *
   * @returns Previous clipping region in form of an array: `[xy, wh]`
   *
   * @category General
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
   * Removes the currently set clipping region, if any.
   *
   * @returns Previous clipping region in form of an array: `[xy, wh]`
   *
   * @category General
   */
  static removeClippingRegion(): [xy: BpxVector2d, wh: BpxVector2d] {
    return BeetPxDraw.#tryGetEngine(
      "removeClippingRegion",
    ).drawApi.removeClippingRegion();
  }

  /**
   * Gets a XY (left-top corner) of a camera's view. Could be used e.g.
   * for drawing a game's HUD, or anything else that should be positioned against
   * the viewport and against the global game canvas' coordinates.
   *
   * @returns Current camera's XY.
   *
   * @category General
   */
  static get cameraXy(): BpxVector2d {
    return BeetPxDraw.#tryGetEngine("setCameraXy").drawApi.getCameraXy();
  }

  /**
   * Sets a new XY (left-top corner) of a camera's view
   *
   * @example
   * ```ts
   * const prevCameraXy = $d.setCameraXy($v(50,50));
   * // draw something that requires the camera to be moved to (50,50)
   * $d.setCameraXy(prevCameraXy);
   * ```
   *
   * @returns Previous camera's XY.
   *
   * @category General
   */
  static setCameraXy(xy: BpxVector2d): BpxVector2d {
    return BeetPxDraw.#tryGetEngine("setCameraXy").drawApi.setCameraXy(xy);
  }

  /**
   * Sets a drawing pattern to use. A drawing pattern is a 4x4 definition of which
   * pixels should be drawn with the `primary` and which with the `secondary` of
   * {@link BpxPatternColors}.
   *
   * @example
   * ```ts
   * const prevPattern = $d.setDrawingPattern(BpxDrawingPattern.from(`
   *   ##--
   *   ##--
   *   --##
   *   --##
   * `));
   * $d.rectFilled($v(10), $v(20), BpxPatternColors.of($rgb_red, $rgb_blue));
   * $d.setDrawingPattern(prevPattern);
   * ```
   *
   * @returns Previously used pattern.
   *
   * @category General
   */
  static setDrawingPattern(pattern: BpxDrawingPattern): BpxDrawingPattern {
    return BeetPxDraw.#tryGetEngine(
      "setDrawingPattern",
    ).drawApi.setDrawingPattern(pattern);
  }

  /**
   * Draws a single colored pixel.
   *
   * @example
   * ```ts
   * $d.pixel($v(10,20), $rgb_red);
   * ```
   *
   * @category Shapes
   */
  static pixel(xy: BpxVector2d, color: BpxRgbColor): void {
    BeetPxDraw.#tryGetEngine("pixel").drawApi.drawPixel(xy, color);
  }

  /**
   * Draws pixels based on a visual 2d representation, defined by {@link BpxPixels}.
   * Helpful for quickly drawing a shape that you don't have a sprite for in your spritesheet.
   *
   * @example
   * ```ts
   * $d.pixels(BpxPixels.from(`
   *   #####
   *   #-#-#
   *   #-#-#
   *   #####
   * `, $v(10,20), $rgb_red);
   * ```
   *
   * @category Shapes
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
   * Draws a line.
   *
   * @see An implementation of Bresenham's Algorithm by Alois Zingl: http://members.chello.at/easyfilter/bresenham.html
   *
   * @category Shapes
   */
  static line(
    xy: BpxVector2d,
    wh: BpxVector2d,
    color: BpxRgbColor | BpxPatternColors | BpxCanvasSnapshotColorMapping,
  ): void {
    BeetPxDraw.#tryGetEngine("line").drawApi.drawLine(xy, wh, color);
  }

  /**
   * Draws a rectangle, boundary only.
   *
   * @param xy Left-top corner.
   *
   * @category Shapes
   */
  static rect(
    xy: BpxVector2d,
    wh: BpxVector2d,
    color: BpxRgbColor | BpxPatternColors | BpxCanvasSnapshotColorMapping,
  ): void {
    BeetPxDraw.#tryGetEngine("rect").drawApi.drawRect(xy, wh, color);
  }

  /**
   * Draws a rectangle, filled.
   *
   * @param xy Left-top corner.
   *
   * @category Shapes
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
   * Draws a rectangle, boundary only, and fills the entire canvas *around* the rectangle.
   *
   * @param xy Left-top corner.
   *
   * @category Shapes
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
   * Draws an ellipse, boundary only.
   *
   * @see An implementation of Bresenham's Algorithm by Alois Zingl: http://members.chello.at/easyfilter/bresenham.html
   *
   * @param xy Left-top corner of a rectangle that the ellipse would fit into.
   *
   * @category Shapes
   */
  static ellipse(
    xy: BpxVector2d,
    wh: BpxVector2d,
    color: BpxRgbColor | BpxPatternColors | BpxCanvasSnapshotColorMapping,
  ): void {
    BeetPxDraw.#tryGetEngine("ellipse").drawApi.drawEllipse(xy, wh, color);
  }

  /**
   * Draws an ellipse, filled.
   *
   * @see An implementation of Bresenham's Algorithm by Alois Zingl: http://members.chello.at/easyfilter/bresenham.html
   *
   * @param xy Left-top corner of a rectangle that the ellipse would fit into.
   *
   * @category Shapes
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
   * Draws an ellipse, boundary only, and fills the entire canvas *around* the ellipse.
   *
   * @see An implementation of Bresenham's Algorithm by Alois Zingl: http://members.chello.at/easyfilter/bresenham.html
   *
   * @param xy Left-top corner of a rectangle that the ellipse would fit into.
   *
   * @category Shapes
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
   * Allows to define a color mapping from the sprite colors to the desired ones.
   *
   * @example
   * ```ts
   * const prevMapping = $d.setSpriteColorMapping(BpxSpriteColorMapping.from([
   *   [$rgb_red, $rgb_blue],
   * ]));
   * $d.sprite(mySprite, $v(10));
   * $d.setSpriteColorMapping(prevMapping);
   * ```
   *
   * @returns Previously used color mapping
   *
   * @category Sprites
   */
  static setSpriteColorMapping(
    spriteColorMapping: BpxSpriteColorMapping,
  ): BpxSpriteColorMapping {
    return BeetPxDraw.#tryGetEngine(
      "setSpriteColorMapping",
    ).drawApi.setSpriteColorMapping(spriteColorMapping);
  }

  /**
   * Draws a given sprite.
   *
   * @example
   * ```ts
   * const mySprite = $spr("spritesheet.png")(8,8,0,0);
   * $d.sprite(mySprite, $v(10));
   * ```
   *
   * @category Sprites
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
   * Sets a font to be used for subsequent text drawing.
   *
   * @see https://github.com/beetrootpaul/beetpx-examples/tree/main/fonts
   *
   * @example
   * ```ts
   * const prevFont = $d.setFont($font_saint11Minimal4);
   * $d.text("hello!", $v(10), $rgb_red);
   * $d.setFont(prevFont);
   * ```
   *
   * @returns Previously used font
   *
   * @category Text
   */
  static setFont(font: BpxFont): BpxFont {
    return BeetPxDraw.#tryGetEngine("setFont").drawApi.setFont(font);
  }

  /**
   * Sets color markers to be used for subsequent text drawing.
   * Color markers are used inside text to indicate places where a color should
   * change to another one.
   *
   * @example
   * ```ts
   * const prevMarkers = $d.setTextColorMarkers({
   *   red_theBest: $rgb_red,
   *   b: $rgb_blue,
   * });
   * $d.text("colors are: green, [b]blue, [red_theBest]red", $v(10), $rgb_green);
   * $d.setTextColorMarkers(prevMarkers);
   * ```
   *
   * @returns Previously used color markers
   *
   * @category Text
   */
  static setTextColorMarkers(
    textColorMarkers: BpxTextColorMarkers,
  ): BpxTextColorMarkers {
    return BeetPxDraw.#tryGetEngine(
      "setTextColorMarkers",
    ).drawApi.setTextColorMarkers(textColorMarkers);
  }

  /**
   * Measures the space that would be occupied by the text if it was drawn on the canvas.
   *
   * @example
   * ```ts
   * const line1Wh = $d.measureText(textLine1).wh;
   * const line2Wh = $d.measureText(textLine2).wh;
   * const line3Wh = $d.measureText(textLine3).wh;
   * const totalW = Math.max(line1Wh.x, line2Wh.x, line3Wh.x);
   * const totalH = line1Wh.y + line2Wh.y + line3Wh.y;
   * const leftTop = $x.canvasSize.div(2).sub(totalW / 2, totalH / 2)
   * ```
   *
   * @category Text
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
   * Draws a text.
   *
   * @example
   * ```ts
   * $d.text("hello!\nThe 2nd line", $v(10), $rgb_red);
   * ```
   *
   * @remarks
   * Use `\n` to split the text into multiple lines (aligned to the left).
   *
   * @category Text
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
   * Takes a snapshot of the canvas, so it can be later used together with {@link BpxCanvasSnapshotColorMapping}.
   * Can be used e.g. for drawing a lighter pixels around light sources.
   *
   * @see https://github.com/beetrootpaul/beetpx-examples/tree/main/canvas-snapshot
   *
   * @example
   * ```ts
   * $d.takeCanvasSnapshot();
   * $d.ellipseFilled(lightXy.sub(lightRadius), $v(lightRadius * 2), BpxCanvasSnapshotColorMapping.of(
   *   (color: BpxRgbColor | null): BpxRgbColor | null =>
   *     color
   *       ? $rgb((50 + color.r) * 1.25, (30 + color.g) * 1.2, (10 + color.b) * 1.05)
   *       : null
   * ));
   * ```
   *
   * @category General
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
