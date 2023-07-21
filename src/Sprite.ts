import { Xy, xy_ } from "./Xy";

export function spr_(x1: number, y1: number, x2: number, y2: number): Sprite {
  return new Sprite(xy_(x1, y1), xy_(x2, y2));
}

// TODO: maybe add a sprite sheet ID or just an image ID?
export class Sprite {
  xy1: Xy;
  xy2: Xy;

  constructor(xy1: Xy, xy2: Xy) {
    this.xy1 = xy1;
    this.xy2 = xy2;
  }

  size(): Xy {
    return xy_(
      Math.abs(this.xy2.x - this.xy1.x),
      Math.abs(this.xy2.y - this.xy1.y),
    );
  }
}
