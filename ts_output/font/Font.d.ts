import { Sprite } from "../Sprite";
import { Vector2d } from "../Vector2d";
export type CharSprite = {
    positionInText: Vector2d;
    sprite: Sprite;
    char: string;
};
export interface Font {
    spritesFor(text: string): CharSprite[];
}
