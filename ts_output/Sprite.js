"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sprite = exports.spr_ = void 0;
const Xy_1 = require("./Xy");
function spr_(x1, y1, x2, y2) {
    return new Sprite((0, Xy_1.xy_)(x1, y1), (0, Xy_1.xy_)(x2, y2));
}
exports.spr_ = spr_;
// TODO: maybe add a sprite sheet ID or just an image ID?
class Sprite {
    constructor(xy1, xy2) {
        this.xy1 = xy1;
        this.xy2 = xy2;
    }
    size() {
        return (0, Xy_1.xy_)(Math.abs(this.xy2.x - this.xy1.x), Math.abs(this.xy2.y - this.xy1.y));
    }
}
exports.Sprite = Sprite;
