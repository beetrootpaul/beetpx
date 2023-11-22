"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.drawingTestSetup = void 0;
const Assets_1 = require("../assets/Assets");
const CanvasForTests_1 = require("../canvas/CanvasForTests");
const DrawApi_1 = require("./DrawApi");
function drawingTestSetup(canvasWidth, canvasHeight, canvasBgColor) {
    const canvas = new CanvasForTests_1.CanvasForTests(canvasWidth, canvasHeight, canvasBgColor);
    const assets = new Assets_1.Assets();
    const drawApi = new DrawApi_1.DrawApi({
        canvas,
        assets,
    });
    return { canvas, assets, drawApi };
}
exports.drawingTestSetup = drawingTestSetup;
