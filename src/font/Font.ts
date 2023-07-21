import { Sprite } from "../Sprite";
import { Xy } from "../Xy";

export type CharSprite = {
  positionInText: Xy;
  sprite: Sprite;
};

export interface Font {
  spritesFor(text: string): CharSprite[];
}
