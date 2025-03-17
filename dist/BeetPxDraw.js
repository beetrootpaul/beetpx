import { Framework } from "./Framework";
import { Logger } from "./logger/Logger";
export class BeetPxDraw {
    constructor() { }
    static #tryGetFramework(calledFnName) {
        if (!Framework.frameworkSingleton) {
            throw Error(`Tried to access BeetPx API without calling BeetPx.start(…) first.`);
        }
        if (!Framework.frameworkSingleton.isInsideDrawOrStartedCallback) {
            Logger.warnBeetPx(`Used "${calledFnName}" outside of either "setOnDraw" or "setOnStarted" callback.`);
        }
        return Framework.frameworkSingleton;
    }
    static clearCanvas(color) {
        BeetPxDraw.#tryGetFramework("clearCanvas").drawApi.clearCanvas(color);
    }
    static setClippingRegion(xy, wh) {
        return BeetPxDraw.#tryGetFramework("setClippingRegion").drawApi.setClippingRegion(xy, wh);
    }
    static removeClippingRegion() {
        return BeetPxDraw.#tryGetFramework("removeClippingRegion").drawApi.removeClippingRegion();
    }
    static get cameraXy() {
        return BeetPxDraw.#tryGetFramework("setCameraXy").drawApi.getCameraXy();
    }
    static setCameraXy(xy) {
        return BeetPxDraw.#tryGetFramework("setCameraXy").drawApi.setCameraXy(xy);
    }
    static setDrawingPattern(pattern) {
        return BeetPxDraw.#tryGetFramework("setDrawingPattern").drawApi.setDrawingPattern(pattern);
    }
    static pixel(xy, color) {
        BeetPxDraw.#tryGetFramework("pixel").drawApi.drawPixel(xy, color);
    }
    static pixels(pixels, xy, color, opts) {
        BeetPxDraw.#tryGetFramework("pixels").drawApi.drawPixels(pixels, xy, color, opts);
    }
    static line(xy, wh, color) {
        BeetPxDraw.#tryGetFramework("line").drawApi.drawLine(xy, wh, color);
    }
    static rect(xy, wh, color) {
        BeetPxDraw.#tryGetFramework("rect").drawApi.drawRect(xy, wh, color);
    }
    static rectFilled(xy, wh, color) {
        BeetPxDraw.#tryGetFramework("rectFilled").drawApi.drawRectFilled(xy, wh, color);
    }
    static rectOutsideFilled(xy, wh, color) {
        BeetPxDraw.#tryGetFramework("rectOutsideFilled").drawApi.drawRectOutsideFilled(xy, wh, color);
    }
    static ellipse(xy, wh, color) {
        BeetPxDraw.#tryGetFramework("ellipse").drawApi.drawEllipse(xy, wh, color);
    }
    static ellipseFilled(xy, wh, color) {
        BeetPxDraw.#tryGetFramework("ellipseFilled").drawApi.drawEllipseFilled(xy, wh, color);
    }
    static ellipseOutsideFilled(xy, wh, color) {
        BeetPxDraw.#tryGetFramework("ellipseOutsideFilled").drawApi.drawEllipseOutsideFilled(xy, wh, color);
    }
    static setSpriteColorMapping(spriteColorMapping) {
        return BeetPxDraw.#tryGetFramework("setSpriteColorMapping").drawApi.setSpriteColorMapping(spriteColorMapping);
    }
    static sprite(sprite, xy, opts) {
        BeetPxDraw.#tryGetFramework("sprite").drawApi.drawSprite(sprite, xy, opts);
    }
    static setFont(font) {
        return BeetPxDraw.#tryGetFramework("setFont").drawApi.setFont(font);
    }
    static setTextColorMarkers(textColorMarkers) {
        return BeetPxDraw.#tryGetFramework("setTextColorMarkers").drawApi.setTextColorMarkers(textColorMarkers);
    }
    static measureText(text, opts) {
        return BeetPxDraw.#tryGetFramework("measureText").drawApi.measureText(text, opts);
    }
    static text(text, xy, color, opts) {
        BeetPxDraw.#tryGetFramework("text").drawApi.drawText(text, xy, color, opts);
    }
    static takeCanvasSnapshot() {
        BeetPxDraw.#tryGetFramework("takeCanvasSnapshot").drawApi.takeCanvasSnapshot();
    }
}
export const $d = BeetPxDraw;
//# sourceMappingURL=BeetPxDraw.js.map