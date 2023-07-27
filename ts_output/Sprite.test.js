"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const Sprite_1 = require("./Sprite");
const Vector2d_1 = require("./Vector2d");
(0, globals_1.describe)("Sprite", () => {
    (0, globals_1.test)("spr_(x1,y1,w,h)", () => {
        // given
        const sprite = (0, Sprite_1.spr_)(1, 20, 300, 4000);
        // expect
        (0, globals_1.expect)(sprite.xy1.x).toEqual(1);
        (0, globals_1.expect)(sprite.xy1.y).toEqual(20);
        (0, globals_1.expect)(sprite.xy2.x).toEqual(301);
        (0, globals_1.expect)(sprite.xy2.y).toEqual(4020);
        (0, globals_1.expect)(sprite.size().x).toEqual(300);
        (0, globals_1.expect)(sprite.size().y).toEqual(4000);
    });
    (0, globals_1.test)("spr_(x1,y1,wh)", () => {
        // given
        const sprite = (0, Sprite_1.spr_)(1, 20, (0, Vector2d_1.v_)(300, 4000));
        // expect
        (0, globals_1.expect)(sprite.xy1.x).toEqual(1);
        (0, globals_1.expect)(sprite.xy1.y).toEqual(20);
        (0, globals_1.expect)(sprite.xy2.x).toEqual(301);
        (0, globals_1.expect)(sprite.xy2.y).toEqual(4020);
        (0, globals_1.expect)(sprite.size().x).toEqual(300);
        (0, globals_1.expect)(sprite.size().y).toEqual(4000);
    });
});
