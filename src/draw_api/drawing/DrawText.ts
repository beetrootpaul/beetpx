import { Assets } from "../../assets/Assets";
import { Canvas } from "../../canvas/Canvas";
import { BpxSpriteColorMapping } from "../../color/SpriteColorMapping";
import { BpxFont } from "../../font/Font";
import { BpxVector2d } from "../../misc/Vector2d";
import { rgb_red_, v_0_0_ } from "../../shorthands";
import { u_ } from "../../Utils";
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
    // TODO: ???
    // fontImage: BpxImageAsset | null,
    canvasXy: BpxVector2d,
    // TODO: ???
    // color: BpxRgbColor,
    scaleXy: BpxVector2d,
    pattern: BpxDrawingPattern,
  ): void {
    canvasXy = canvasXy.round();
    scaleXy = BpxVector2d.max(scaleXy.floor(), v_0_0_);

    // TODO: ???
    // const colorMapping =
    // typeof color === "function"
    //   ? (charSprite: BpxCharSprite) =>
    //       BpxSpriteColorMapping.of((spriteColor) =>
    //         spriteColor?.cssHex === font.spriteTextColor?.cssHex
    //           ? color(charSprite)
    //           : null,
    //       )
    //   : BpxSpriteColorMapping.of((spriteColor) =>
    //       spriteColor?.cssHex === font.spriteTextColor?.cssHex ? color : null,
    //     );

    for (const arrangedGlyph of font.arrangeGlyphsFor(text)) {
      const xy = canvasXy.add(arrangedGlyph.leftTop.mul(scaleXy));
      if (arrangedGlyph.type === "sprite") {
        // TODO: ???
        //     if (font.imageUrl == null) {
        //       throw Error(
        //         `There is no imageUrl defined for a font "${font.id}", which uses image sprites`,
        //       );
        //     }
        //     // TODO: move font image to each char sprite maybe?
        //     if (fontImage == null) {
        //       throw Error(
        //         `There is no image loaded for a font "${font.id}", which uses image sprites`,
        //       );
        //     }
        this.#sprite.draw(
          arrangedGlyph.sprite,
          // TODO: ???
          //       spr_(font.imageUrl)(
          //         charSprite.spriteXyWh[1].x,
          //         charSprite.spriteXyWh[1].y,
          //         charSprite.spriteXyWh[0].x,
          //         charSprite.spriteXyWh[0].y,
          //       ),
          //       fontImage,
          this.#assets.getImageAsset(arrangedGlyph.sprite.imageUrl),
          xy,
          scaleXy,
          // TODO: ???
          //       typeof colorMapping === "function"
          //         ? colorMapping(charSprite)
          //         : colorMapping,
          BpxSpriteColorMapping.noMapping,
          pattern,
        );
      } else if (arrangedGlyph.type === "pixels") {
        this.#pixels.draw(
          arrangedGlyph.pixels,
          xy,
          // TODO: ???
          // typeof color === "function" ? color(charSprite) : color,
          rgb_red_,
          scaleXy,
          pattern,
        );
      } else {
        u_.assertUnreachable(arrangedGlyph);
      }
    }
  }
}
