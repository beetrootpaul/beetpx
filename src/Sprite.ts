import { v_, Vector2d } from "./Vector2d";

export function spr_(x1: number, y1: number, wh: Vector2d): Sprite;
export function spr_(x1: number, y1: number, w: number, h: number): Sprite;
export function spr_(
  x1: number,
  y1: number,
  wh: Vector2d | number,
  h?: number,
): Sprite {
  const xy1 = v_(x1, y1);
  return wh instanceof Vector2d
    ? new Sprite(xy1, xy1.add(wh))
    : new Sprite(xy1, xy1.add(v_(wh, h!)));
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
