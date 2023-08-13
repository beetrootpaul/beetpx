import { ImageUrl } from "../Assets";
import { Sprite } from "../Sprite";
import { Vector2d } from "../Vector2d";

export type CharSprite = {
  positionInText: Vector2d;
  sprite: Sprite;
  char: string;
};

export interface Font {
  readonly imageUrl: ImageUrl;
  spritesFor(text: string): CharSprite[];
}
