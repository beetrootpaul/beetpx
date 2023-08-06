"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sprite = exports.spr_ = void 0;
const Vector2d_1 = require("./Vector2d");
function spr_(x1, y1, wh, h) {
    const xy1 = (0, Vector2d_1.v_)(x1, y1);
    return wh instanceof Vector2d_1.Vector2d
        ? new Sprite(xy1, xy1.add(wh))
        : new Sprite(xy1, xy1.add((0, Vector2d_1.v_)(wh, h)));
}
exports.spr_ = spr_;
// TODO: maybe add a sprite sheet ID or just an image ID? There is no need for it, but it
//       would express the fact that sprite is related to a specific sprite sheet only
class Sprite {
    constructor(xy1, xy2) {
        this.xy1 = xy1;
        this.xy2 = xy2;
    }
    size() {
        return (0, Vector2d_1.v_)(Math.abs(this.xy2.x - this.xy1.x), Math.abs(this.xy2.y - this.xy1.y));
    }
}
exports.Sprite = Sprite;
