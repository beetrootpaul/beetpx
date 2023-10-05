import { BpxImageUrl } from "../Assets";
import { BpxSprite } from "../Sprite";
import { BpxVector2d } from "../Vector2d";

export type BpxCharSprite = {
  positionInText: BpxVector2d;
  sprite: BpxSprite;
  char: string;
};

export type BpxFontId = string;

export interface BpxFont {
  readonly id: BpxFontId;
  readonly imageUrl: BpxImageUrl;
  spritesFor(text: string): BpxCharSprite[];
}
