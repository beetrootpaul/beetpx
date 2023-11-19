import { BpxImageUrl } from "../assets/Assets";
import { BpxPixels } from "../draw_api/Pixels";
import { BpxVector2d } from "../misc/Vector2d";

export type BpxCharSprite = {
  char: string;
  positionInText: BpxVector2d;
} & (
  | {
      type: "image";
      spriteXyWh: [BpxVector2d, BpxVector2d];
    }
  | {
      type: "pixels";
      pixels: BpxPixels;
    }
);

export type BpxFontId = string;

export interface BpxFont {
  readonly id: BpxFontId;
  readonly imageUrl: BpxImageUrl | null;
  spritesFor(text: string): BpxCharSprite[];
}
