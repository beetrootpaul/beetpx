"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BpxSprite = exports.spr_ = void 0;
const Vector2d_1 = require("../misc/Vector2d");
function spr_(imageUrl) {
    return (x1, y1, w, h) => {
        const xy1 = (0, Vector2d_1.v_)(x1, y1);
        return new BpxSprite(imageUrl, xy1, xy1.add((0, Vector2d_1.v_)(w, h)));
    };
}
exports.spr_ = spr_;
class BpxSprite {
    constructor(imageUrl, xy1, xy2) {
        this.imageUrl = imageUrl;
        this.xy1 = xy1.round();
        this.xy2 = xy2.round();
    }
    size() {
        return (0, Vector2d_1.v_)(Math.abs(this.xy2.x - this.xy1.x), Math.abs(this.xy2.y - this.xy1.y));
    }
}
exports.BpxSprite = BpxSprite;
