import { BpxVector2d } from "../misc/Vector2d";
export function spr_(imageUrl) {
    return (w, h, x, y) => BpxSprite.from(imageUrl, w, h, x, y);
}
export class BpxSprite {
    static from(imageUrl, w, h, x, y) {
        return new BpxSprite(imageUrl, w, h, x, y);
    }
    constructor(imageUrl, w, h, x, y) {
        this.type = "static";
        if (w < 0) {
            w = -w;
            x -= w;
        }
        if (h < 0) {
            h = -h;
            y -= h;
        }
        this.imageUrl = imageUrl;
        this.xy = BpxVector2d.of(x, y).round();
        this.size = BpxVector2d.of(x + w, y + h)
            .round()
            .sub(this.xy);
    }
    clipBy(xy1, xy2) {
        const xy = this.xy.clamp(xy1, xy2);
        const wh = this.xy.add(this.size).clamp(xy1, xy2).sub(xy);
        return new BpxSprite(this.imageUrl, wh.x, wh.y, xy.x, xy.y);
    }
}
