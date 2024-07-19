import { BpxVector2d } from "../misc/Vector2d";
import { throwError } from "../utils/throwError";
import { Canvas } from "./Canvas";
import { CanvasSnapshotForProduction } from "./CanvasSnapshotForProduction";
export class CanvasForProduction extends Canvas {
    #length;
    #htmlCanvas;
    #htmlCanvasContext;
    #offscreenContext;
    #offscreenImageData;
    constructor(canvasSize, htmlCanvas, htmlCanvasBackground) {
        super(canvasSize);
        this.#length = canvasSize.x * canvasSize.y;
        this.#htmlCanvas = htmlCanvas;
        this.#htmlCanvas.style.backgroundColor = htmlCanvasBackground.cssHex;
        this.#htmlCanvasContext =
            this.#htmlCanvas.getContext("2d", {
                colorSpace: "srgb",
                
                alpha: true,
            }) ?? throwError("Was unable to obtain '2d' context from <canvas>");
        this.#htmlCanvasContext.imageSmoothingEnabled = false;
        const offscreenCanvas = document
            .createElement("canvas")
            .transferControlToOffscreen();
        offscreenCanvas.width = canvasSize.x;
        offscreenCanvas.height = canvasSize.y;
        this.#offscreenContext =
            offscreenCanvas.getContext("2d", {
                colorSpace: "srgb",
                
                alpha: false,
            }) ??
                throwError("Was unable to obtain '2d' context from OffscreenCanvas");
        this.#offscreenImageData = this.#offscreenContext.createImageData(this.#offscreenContext.canvas.width, this.#offscreenContext.canvas.height, { colorSpace: "srgb" });
        this.#initializeAsNonTransparent();
    }
    set(color, x, y) {
        if (x < 0 || y < 0 || x >= this.canvasSize.x || y >= this.canvasSize.y) {
            throw Error(`(x,y) index out of bounds: (x,y) = (${x},${y}), bottom bound = (0,0), upper bound = (${this.canvasSize.x - 1},${this.canvasSize.y - 1})`);
        }
        const index = y * this.canvasSize.x + x;
        if (index >= this.#length) {
            throw Error(`index out of bounds: index = ${index}, max allowed index = ${this.#length - 1}`);
        }
        const dataIndex = index * 4;
        this.#offscreenImageData.data[dataIndex] = color.r;
        this.#offscreenImageData.data[dataIndex + 1] = color.g;
        this.#offscreenImageData.data[dataIndex + 2] = color.b;
    }
    newSnapshot() {
        return new CanvasSnapshotForProduction(this.#offscreenImageData.data.slice(), this.canvasSize.x);
    }
    doRender() {
        this.#offscreenContext.putImageData(this.#offscreenImageData, 0, 0);
        const htmlCanvasSize = BpxVector2d.of(this.#htmlCanvas.width, this.#htmlCanvas.height);
        const scaleToFill = Math.max(1, Math.min(htmlCanvasSize.div(this.canvasSize).floor().x, htmlCanvasSize.div(this.canvasSize).floor().y));
        const centeringOffset = htmlCanvasSize
            .sub(this.canvasSize.mul(scaleToFill))
            .div(2)
            .floor();
        this.#htmlCanvasContext.drawImage(this.#offscreenContext.canvas, 0, 0, this.#offscreenContext.canvas.width, this.#offscreenContext.canvas.height, centeringOffset.x, centeringOffset.y, scaleToFill * this.canvasSize.x, scaleToFill * this.canvasSize.y);
    }
    #initializeAsNonTransparent() {
        for (let i = 3; i < this.#offscreenImageData.data.length; i += 4) {
            this.#offscreenImageData.data[i] = 0xff;
        }
    }
}
