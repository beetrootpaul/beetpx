import { BpxSprite } from "../draw_api/Sprite";
import { BpxImageUrl } from "../misc/Assets";
import { BpxVector2d } from "../misc/Vector2d";

// TODO: allow pixels instead of images + provide user with a default font

export type BpxCharSprite = {
  positionInText: BpxVector2d;
  sprite: BpxSprite;
  char: string;
};

export type BpxFontId = string;

export interface BpxFont {
  readonly id: BpxFontId;
  // TODO: an API design issue: you have to specify imageUrl, but then you still can use another image in `BpxCharSprite.sprite`s
  readonly imageUrl: BpxImageUrl;
  spritesFor(text: string): BpxCharSprite[];
}
