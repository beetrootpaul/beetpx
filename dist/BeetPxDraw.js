import { Engine } from "./Engine";
import { Logger } from "./logger/Logger";
export class BeetPxDraw {
    constructor() { }
    static #tryGetEngine(calledFnName) {
        if (!Engine.engineSingleton) {
            throw Error(`Tried to access BeetPx API without calling BeetPx.start(…) first.`);
        }
        if (!Engine.engineSingleton.isInsideDrawOrStartedCallback) {
            Logger.warnBeetPx(`Used "${calledFnName}" outside of either "setOnDraw" or "setOnStarted" callback.`);
        }
        return Engine.engineSingleton;
    }
    static clearCanvas(color) {
        BeetPxDraw.#tryGetEngine("clearCanvas").drawApi.clearCanvas(color);
    }
    static setClippingRegion(xy, wh) {
        return BeetPxDraw.#tryGetEngine("setClippingRegion").drawApi.setClippingRegion(xy, wh);
    }
    static removeClippingRegion() {
        return BeetPxDraw.#tryGetEngine("removeClippingRegion").drawApi.removeClippingRegion();
    }
    static setCameraXy(xy) {
        return BeetPxDraw.#tryGetEngine("setCameraXy").drawApi.setCameraXy(xy);
    }
    static setDrawingPattern(pattern) {
        return BeetPxDraw.#tryGetEngine("setDrawingPattern").drawApi.setDrawingPattern(pattern);
    }
    static pixel(xy, color) {
        BeetPxDraw.#tryGetEngine("pixel").drawApi.drawPixel(xy, color);
    }
    static pixels(pixels, xy, color, opts) {
        BeetPxDraw.#tryGetEngine("pixels").drawApi.drawPixels(pixels, xy, color, opts);
    }
    static line(xy, wh, color) {
        BeetPxDraw.#tryGetEngine("line").drawApi.drawLine(xy, wh, color);
    }
    static rect(xy, wh, color) {
        BeetPxDraw.#tryGetEngine("rect").drawApi.drawRect(xy, wh, color);
    }
    static rectFilled(xy, wh, color) {
        BeetPxDraw.#tryGetEngine("rectFilled").drawApi.drawRectFilled(xy, wh, color);
    }
    static rectOutsideFilled(xy, wh, color) {
        BeetPxDraw.#tryGetEngine("rectOutsideFilled").drawApi.drawRectOutsideFilled(xy, wh, color);
    }
    static ellipse(xy, wh, color) {
        BeetPxDraw.#tryGetEngine("ellipse").drawApi.drawEllipse(xy, wh, color);
    }
    static ellipseFilled(xy, wh, color) {
        BeetPxDraw.#tryGetEngine("ellipseFilled").drawApi.drawEllipseFilled(xy, wh, color);
    }
    static ellipseOutsideFilled(xy, wh, color) {
        BeetPxDraw.#tryGetEngine("ellipseOutsideFilled").drawApi.drawEllipseOutsideFilled(xy, wh, color);
    }
    static setSpriteColorMapping(spriteColorMapping) {
        return BeetPxDraw.#tryGetEngine("setSpriteColorMapping").drawApi.setSpriteColorMapping(spriteColorMapping);
    }
    static sprite(sprite, xy, opts) {
        BeetPxDraw.#tryGetEngine("sprite").drawApi.drawSprite(sprite, xy, opts);
    }
    static setFont(font) {
        return BeetPxDraw.#tryGetEngine("setFont").drawApi.setFont(font);
    }
    static setTextColorMarkers(textColorMarkers) {
        return BeetPxDraw.#tryGetEngine("setTextColorMarkers").drawApi.setTextColorMarkers(textColorMarkers);
    }
    static measureText(text, opts) {
        return BeetPxDraw.#tryGetEngine("measureText").drawApi.measureText(text, opts);
    }
    static text(text, xy, color, opts) {
        BeetPxDraw.#tryGetEngine("text").drawApi.drawText(text, xy, color, opts);
    }
    static takeCanvasSnapshot() {
        BeetPxDraw.#tryGetEngine("takeCanvasSnapshot").drawApi.takeCanvasSnapshot();
    }
}
export const $d = BeetPxDraw;
//# sourceMappingURL=BeetPxDraw.js.map