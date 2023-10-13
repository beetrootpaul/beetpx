import { v2d_, v_ } from "./Vector2d";
export function spr_(imageUrl) {
    return (x1, y1, w, h) => {
        const xy1 = v2d_(x1, y1);
        return new BpxSprite(imageUrl, xy1, v_.add(xy1, [w, h]));
    };
}
export class BpxSprite {
    constructor(imageUrl, xy1, xy2) {
        this.imageUrl = imageUrl;
        this.xy1 = v_.round(xy1);
        this.xy2 = v_.round(xy2);
    }
    size() {
        return v2d_(Math.abs(this.xy2[0] - this.xy1[0]), Math.abs(this.xy2[1] - this.xy1[1]));
    }
}
