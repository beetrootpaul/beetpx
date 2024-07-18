import { BpxVector2d } from "../../misc/Vector2d";
import { v_0_0_ } from "../../shorthands";
import { assertUnreachable } from "../../utils/assertUnreachable";
import { DrawPixels } from "./DrawPixels";
import { DrawSprite } from "./DrawSprite";
export class DrawText {
    #canvas;
    #assets;
    #sprite;
    #pixels;
    constructor(canvas, assets) {
        this.#canvas = canvas;
        this.#assets = assets;
        this.#sprite = new DrawSprite(this.#canvas, {
            disableRounding: true,
        });
        this.#pixels = new DrawPixels(this.#canvas, {
            disableRounding: true,
        });
    }
    draw(text, font, canvasXy, color, colorMarkers, scaleXy, pattern) {
        canvasXy = canvasXy.round();
        scaleXy = BpxVector2d.max(scaleXy.floor(), v_0_0_);
        for (const arrangedGlyph of font.arrangeGlyphsFor(text, color, colorMarkers)) {
            if (arrangedGlyph.type === "line_break")
                continue;
            const xy = canvasXy.add(arrangedGlyph.leftTop.mul(scaleXy));
            if (arrangedGlyph.type === "sprite") {
                this.#sprite.draw(arrangedGlyph.sprite, this.#assets.getImageAsset(arrangedGlyph.sprite.imageUrl), xy, scaleXy, [false, false], arrangedGlyph.spriteColorMapping, pattern);
            }
            else if (arrangedGlyph.type === "pixels") {
                this.#pixels.draw(arrangedGlyph.pixels, xy, arrangedGlyph.color, scaleXy, [false, false], pattern);
            }
            else {
                assertUnreachable(arrangedGlyph);
            }
        }
    }
}
