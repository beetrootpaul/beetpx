import { v_ } from "../misc/Vector2d";
export function spr_(imageUrl) {
    return (x1, y1, w, h) => {
        const xy1 = v_(x1, y1);
        return BpxSprite.of(imageUrl, xy1, xy1.add(v_(w, h)));
    };
}
export class BpxSprite {
    static of(imageUrl, xy1, xy2) {
        return new BpxSprite(imageUrl, xy1, xy2);
    }
    constructor(imageUrl, xy1, xy2) {
        this.imageUrl = imageUrl;
        this.xy1 = xy1.round();
        this.xy2 = xy2.round();
    }
    size() {
        return v_(Math.abs(this.xy2.x - this.xy1.x), Math.abs(this.xy2.y - this.xy1.y));
    }
}
