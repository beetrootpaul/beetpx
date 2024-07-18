import { b_ } from "../BeetPx";
import { font_pico8_, rgb_p8_ } from "../shorthands";
import { BpxUtils } from "../utils/Utils";
export class FpsDisplay {
    #drawApi;
    #color;
    #canvasSize;
    #alignTop;
    #alignLeft;
    constructor(drawApi, canvasSize, params) {
        this.#drawApi = drawApi;
        this.#color = params.color ?? rgb_p8_.orange;
        this.#canvasSize = canvasSize;
        const placement = params.placement ?? "top-right";
        this.#alignLeft = placement.endsWith("-left");
        this.#alignTop = placement.startsWith("top-");
        this.#recentSamples = Array.from({ length: 15 }, () => 0);
        this.#nextSampleIndex = 0;
        this.#lastCalculatedAverageFps = 0;
    }
    #recentSamples;
    #nextSampleIndex;
    #lastCalculatedAverageFps;
    
    drawRenderingFps(renderingFps) {
        this.#recentSamples[this.#nextSampleIndex] = renderingFps;
        this.#nextSampleIndex = BpxUtils.mod(this.#nextSampleIndex + 1, this.#recentSamples.length);
        if (this.#nextSampleIndex === 0) {
            this.#lastCalculatedAverageFps = 0;
            for (const sample of this.#recentSamples) {
                this.#lastCalculatedAverageFps += sample;
            }
            this.#lastCalculatedAverageFps /= this.#recentSamples.length;
        }
        const prevFont = this.#drawApi.useFont(font_pico8_);
        const text = this.#lastCalculatedAverageFps.toFixed();
        const wh = b_.measureText(text).wh;
        this.#drawApi.drawText(text, this.#drawApi.cameraXy.add(this.#alignLeft ? 1 : this.#canvasSize.x - wh.x - 1, this.#alignTop ? 1 : this.#canvasSize.y - wh.y - 1), this.#color);
        this.#drawApi.useFont(prevFont);
    }
}
