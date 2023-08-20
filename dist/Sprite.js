import { v_ } from "./Vector2d";
export function spr_(imageUrl) {
    return (x1, y1, w, h) => {
        const xy1 = v_(x1, y1);
        return new Sprite(imageUrl, xy1, xy1.add(v_(w, h)));
    };
}
// TODO: maybe add a sprite sheet ID or just an image ID? There is no need for it, but it
//       would express the fact that sprite is related to a specific sprite sheet only
export class Sprite {
    constructor(imageUrl, xy1, xy2) {
        this.imageUrl = imageUrl;
        this.xy1 = xy1;
        this.xy2 = xy2;
    }
    size() {
        return v_(Math.abs(this.xy2.x - this.xy1.x), Math.abs(this.xy2.y - this.xy1.y));
    }
}
