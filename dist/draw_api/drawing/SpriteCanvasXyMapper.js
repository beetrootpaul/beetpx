import { $v } from "../../shorthands";
export class SpriteCanvasXyMapper {
    #targetXy;
    #scaleXy;
    constructor(targetXy, scaleXy) {
        this.#targetXy = targetXy;
        this.#scaleXy = scaleXy;
    }
    toCanvasXy(spriteXy) {
        return $v(this.#targetXy.x + spriteXy.x * this.#scaleXy.x, this.#targetXy.y + spriteXy.y * this.#scaleXy.y);
    }
    toSpriteXy(canvasX, canvasY) {
        return [
            this.#scaleXy.x === 0
                ? 0
                : Math.floor((canvasX - this.#targetXy.x) / this.#scaleXy.x),
            this.#scaleXy.y === 0
                ? 0
                : Math.floor((canvasY - this.#targetXy.y) / this.#scaleXy.y),
        ];
    }
}
//# sourceMappingURL=SpriteCanvasXyMapper.js.map