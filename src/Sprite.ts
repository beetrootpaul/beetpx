import { Vector2d, v_ } from "./Vector2d";

export function spr_(x1: number, y1: number, x2: number, y2: number): Sprite {
  return new Sprite(v_(x1, y1), v_(x2, y2));
}

// TODO: maybe add a sprite sheet ID or just an image ID? There is no need for it, but it
//       would express the fact that sprite is related to a specific sprite sheet only
export class Sprite {
  xy1: Vector2d;
  xy2: Vector2d;

  constructor(xy1: Vector2d, xy2: Vector2d) {
    this.xy1 = xy1;
    this.xy2 = xy2;
  }

  size(): Vector2d {
    return v_(
      Math.abs(this.xy2.x - this.xy1.x),
      Math.abs(this.xy2.y - this.xy1.y),
    );
  }
}
