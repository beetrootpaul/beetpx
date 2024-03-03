import { BpxImageUrl } from "../assets/Assets";
import { BpxRgbColor } from "../color/RgbColor";
import { BpxPixels } from "../draw_api/Pixels";
import { BpxVector2d } from "../misc/Vector2d";

export type BpxCharSprite = {
  char: string;
  positionInText: BpxVector2d;
} & (
  | {
      type: "image";
      spriteXyWh: [xy: BpxVector2d, wh: BpxVector2d];
    }
  | {
      type: "pixels";
      pixels: BpxPixels;
    }
);

export type BpxFontId = string;

export interface BpxFont {
  // TODO: is ID really needed still?
  readonly id: BpxFontId;
  readonly imageUrl: BpxImageUrl | null;
  spritesFor(text: string): BpxCharSprite[];

  readonly spriteTextColor: BpxRgbColor | null;
}
