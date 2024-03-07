import { Assets } from "../assets/Assets";
import { CanvasForTests } from "../canvas/CanvasForTests";
import { DrawApi } from "./DrawApi";
export function drawingTestSetup(canvasWidth, canvasHeight, canvasBgColor) {
    const canvas = new CanvasForTests(canvasWidth, canvasHeight, canvasBgColor);
    const assets = new Assets();
    const drawApi = new DrawApi({
        canvas,
        assets,
    });
    return { canvas, assets, drawApi };
}
