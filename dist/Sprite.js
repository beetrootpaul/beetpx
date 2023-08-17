"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sprite = exports.spr_ = void 0;
const Vector2d_1 = require("./Vector2d");
function spr_(imageUrl) {
    return (x1, y1, w, h) => {
        const xy1 = (0, Vector2d_1.v_)(x1, y1);
        return new Sprite(imageUrl, xy1, xy1.add((0, Vector2d_1.v_)(w, h)));
    };
}
exports.spr_ = spr_;
// TODO: maybe add a sprite sheet ID or just an image ID? There is no need for it, but it
//       would express the fact that sprite is related to a specific sprite sheet only
class Sprite {
    constructor(imageUrl, xy1, xy2) {
        this.imageUrl = imageUrl;
        this.xy1 = xy1;
        this.xy2 = xy2;
    }
    size() {
        return (0, Vector2d_1.v_)(Math.abs(this.xy2.x - this.xy1.x), Math.abs(this.xy2.y - this.xy1.y));
    }
}
exports.Sprite = Sprite;
