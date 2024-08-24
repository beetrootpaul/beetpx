import { BpxVector2d } from "../../misc/Vector2d";
import { $v, $v_0_0 } from "../../shorthands";
import { PreparedSprites } from "../PreparedSprites";
import { SpriteCanvasXyMapper } from "./SpriteCanvasXyMapper";
export class DrawSprite {
    #preparedSprites = new PreparedSprites();
    #canvas;
    #options;
    constructor(canvas, options) {
        options ??= {};
        this.#canvas = canvas;
        this.#options = options;
    }
    draw(sprite, sourceImageAsset, targetXy, scaleXy, flipXy, colorMapping, pattern) {
        targetXy = this.#options.disableRounding ? targetXy : targetXy.round();
        scaleXy = BpxVector2d.maxOf(scaleXy.floor(), $v_0_0);
        if (scaleXy.x === 0 || scaleXy.y === 0) {
            return;
        }
        const { width: imgW, height: imgH, channels: imgChannels, rgba8bitData: imgBytes, } = sourceImageAsset;
        sprite = sprite.clipBy($v_0_0, $v(imgW, imgH));
        if (sprite.size.x === 0 || sprite.size.y === 0) {
            return;
        }
        if (!this.#canvas.canSetAny(targetXy.x, targetXy.y, targetXy.x + sprite.size.x * scaleXy.x - 1, targetXy.y + sprite.size.y * scaleXy.y - 1)) {
            return;
        }
        const xyMapper = new SpriteCanvasXyMapper(targetXy, scaleXy);
        const canvasXy1 = xyMapper
            .toCanvasXy($v_0_0)
            .clamp($v_0_0, this.#canvas.canvasSize);
        const canvasXy2 = xyMapper
            .toCanvasXy(sprite.size)
            .clamp($v_0_0, this.#canvas.canvasSize);
        const ps = this.#preparedSprites.prepareOrGetFromCache(sprite, flipXy, imgBytes, imgW, imgChannels);
        for (let cX = canvasXy1.x; cX < canvasXy2.x; cX += 1) {
            for (let cY = canvasXy1.y; cY < canvasXy2.y; cY += 1) {
                const [sX, sY] = xyMapper.toSpriteXy(cX, cY);
                if (pattern.hasPrimaryColorAt(cX, cY)) {
                    const color = ps.colors[sX][sY];
                    const mappedColor = colorMapping.getMappedColor(color, sX, sY);
                    if (mappedColor) {
                        this.#canvas.set(mappedColor, cX, cY);
                    }
                }
            }
        }
    }
}
//# sourceMappingURL=DrawSprite.js.map