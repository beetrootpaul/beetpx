import { Assets } from "../../assets/Assets";
import { Canvas } from "../../canvas/Canvas";
import { BpxRgbColor } from "../../color/RgbColor";
import { BpxFont, BpxTextColorMarkers } from "../../font/Font";
import { BpxVector2d } from "../../misc/Vector2d";
import { v_0_0_ } from "../../shorthands";
import { assertUnreachable } from "../../utils/assertUnreachable";
import { BpxDrawingPattern } from "../DrawingPattern";
import { DrawPixels } from "./DrawPixels";
import { DrawSprite } from "./DrawSprite";

export class DrawText {
  readonly #canvas: Canvas;

  readonly #assets: Assets;

  readonly #sprite: DrawSprite;
  readonly #pixels: DrawPixels;

  constructor(canvas: Canvas, assets: Assets) {
    this.#canvas = canvas;

    this.#assets = assets;

    this.#sprite = new DrawSprite(this.#canvas, {
      disableRounding: true,
    });
    this.#pixels = new DrawPixels(this.#canvas, {
      disableRounding: true,
    });
  }

  draw(
    text: string,
    font: BpxFont,
    canvasXy: BpxVector2d,
    color: BpxRgbColor,
    colorMarkers: BpxTextColorMarkers,
    scaleXy: BpxVector2d,
    pattern: BpxDrawingPattern,
  ): void {
    canvasXy = canvasXy.round();
    scaleXy = BpxVector2d.max(scaleXy.floor(), v_0_0_);

    for (const arrangedGlyph of font.arrangeGlyphsFor(
      text,
      color,
      colorMarkers,
    )) {
      const xy = canvasXy.add(arrangedGlyph.leftTop.mul(scaleXy));
      if (arrangedGlyph.type === "sprite") {
        this.#sprite.draw(
          arrangedGlyph.sprite,
          this.#assets.getImageAsset(arrangedGlyph.sprite.imageUrl),
          xy,
          scaleXy,
          arrangedGlyph.spriteColorMapping,
          pattern,
        );
      } else if (arrangedGlyph.type === "pixels") {
        this.#pixels.draw(
          arrangedGlyph.pixels,
          xy,
          arrangedGlyph.color,
          scaleXy,
          pattern,
        );
      } else {
        assertUnreachable(arrangedGlyph);
      }
    }
  }
}
