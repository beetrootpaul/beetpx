var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _CanvasPixelsWebGl2_length, _CanvasPixelsWebGl2_xyzRgbValues, _CanvasPixelsWebGl2_gl, _CanvasPixelsWebGl2_pixelsProgram;
import { u_ } from "../../Utils";
import { CanvasPixels } from "./CanvasPixels";
import { CanvasPixelsWebGl2Snapshot } from "./CanvasPixelsWebGl2Snapshot";
// TODO: PERFORMANCE IS WORSE FOR THIS ONE. LETS REMOVE ABILITY TO CHOOSE WEBGL2
export class CanvasPixelsWebGl2 extends CanvasPixels {
    constructor(canvasSize, htmlCanvas, htmlCanvasBackground) {
        var _a, _b, _c, _d;
        super(canvasSize);
        _CanvasPixelsWebGl2_length.set(this, void 0);
        _CanvasPixelsWebGl2_xyzRgbValues.set(this, void 0);
        _CanvasPixelsWebGl2_gl.set(this, void 0);
        _CanvasPixelsWebGl2_pixelsProgram.set(this, void 0);
        __classPrivateFieldSet(this, _CanvasPixelsWebGl2_length, canvasSize.x * canvasSize.y, "f");
        // TODO: REWORK
        const hex2rgb = (hex) => {
            return [
                parseInt(hex.slice(1, 3), 16) / 255,
                parseInt(hex.slice(3, 5), 16) / 255,
                parseInt(hex.slice(5, 8), 16) / 255,
            ];
        };
        const normalize = (x1, y1) => {
            return [
                ((x1 + 0.5) / canvasSize.x) * 2 - 1,
                ((y1 + 0.5) / canvasSize.y) * 2 - 1,
                0,
            ];
        };
        __classPrivateFieldSet(this, _CanvasPixelsWebGl2_xyzRgbValues, new Float32Array([
            ...u_
                .range(__classPrivateFieldGet(this, _CanvasPixelsWebGl2_length, "f"))
                .map((_, i) => [i % canvasSize.y, Math.floor(i / canvasSize.y), "#3aab00"])
                .map(([x, y, hex]) => [...normalize(x, y), ...hex2rgb(hex)])
                .flat(),
        ]), "f");
        // TODO: ???
        // canvas.width = 16;
        // canvas.height = 16;
        // canvas.style.backgroundColor = "grey";
        // this.#htmlCanvas = htmlCanvas;
        htmlCanvas.style.backgroundColor = htmlCanvasBackground.asRgbCssHex();
        const gl = (_a = htmlCanvas.getContext("webgl2", {
            // we allow transparency in order ot make background color visible around the game itself
            alpha: true,
        })) !== null && _a !== void 0 ? _a : u_.throwError("CanvasPixelsWebGl2: Was unable to obtain 'webgl2' context from <canvas>");
        __classPrivateFieldSet(this, _CanvasPixelsWebGl2_gl, gl, "f");
        const vertexShader = (_b = gl.createShader(gl.VERTEX_SHADER)) !== null && _b !== void 0 ? _b : u_.throwError("CanvasPixelsWebGl2: failed to create a vertex shader");
        gl.shaderSource(vertexShader, `
        attribute vec4 position;
        attribute vec4 color;
        varying vec4 v_color;
        uniform float size;
        void main() {
            gl_Position = position;
            v_color = color;
            gl_PointSize = size;
        }
      `);
        gl.compileShader(vertexShader);
        const fragmentShader = (_c = gl.createShader(gl.FRAGMENT_SHADER)) !== null && _c !== void 0 ? _c : u_.throwError("CanvasPixelsWebGl2: failed to create a fragment shader");
        gl.shaderSource(fragmentShader, `
      precision mediump float;
      varying vec4 v_color;
      void main() {
          gl_FragColor = v_color;
      }
    `);
        gl.compileShader(fragmentShader);
        const pixelsProgram = (_d = gl.createProgram()) !== null && _d !== void 0 ? _d : u_.throwError("CanvasPixelsWebGl2: failed to create a program");
        __classPrivateFieldSet(this, _CanvasPixelsWebGl2_pixelsProgram, pixelsProgram, "f");
        gl.attachShader(pixelsProgram, vertexShader);
        gl.attachShader(pixelsProgram, fragmentShader);
        gl.linkProgram(pixelsProgram);
        // TODO: needed?
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.useProgram(pixelsProgram);
        // TODO: REWORK
        gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
        const xyzRgbElementSize = __classPrivateFieldGet(this, _CanvasPixelsWebGl2_xyzRgbValues, "f").BYTES_PER_ELEMENT;
        // TODO: REWORK
        // Bind the attribute position to the 1st, 2nd and 3rd floats in every chunk of 6 floats in the buffer
        const position = gl.getAttribLocation(pixelsProgram, "position");
        gl.vertexAttribPointer(position, // target
        3, // interleaved data size
        gl.FLOAT, // type
        false, // normalize
        xyzRgbElementSize * 6, // stride (chunk size)
        0);
        gl.enableVertexAttribArray(position);
        // TODO: REWORK
        // Bind the attribute color to the 3rd, 4th and 5th float in every chunk
        const color = gl.getAttribLocation(pixelsProgram, "color");
        gl.vertexAttribPointer(color, // target
        3, // interleaved chunk size
        gl.FLOAT, // type
        false, // normalize
        xyzRgbElementSize * 6, // stride
        xyzRgbElementSize * 3);
        gl.enableVertexAttribArray(color);
        const size = gl.getUniformLocation(pixelsProgram, "size");
        gl.uniform1f(size, 1);
    }
    set(index, color) {
        if (index >= __classPrivateFieldGet(this, _CanvasPixelsWebGl2_length, "f")) {
            throw Error(`CanvasPixelsWebGl2: index out of bounds: index = ${index}, maxAllowedIndex = ${__classPrivateFieldGet(this, _CanvasPixelsWebGl2_length, "f") - 1}`);
        }
        // TODO: ???
        // TODO: DOES IT WORK AT ALL?
        __classPrivateFieldGet(this, _CanvasPixelsWebGl2_xyzRgbValues, "f")[6 * index + 3] = color.r / 0xff;
        __classPrivateFieldGet(this, _CanvasPixelsWebGl2_xyzRgbValues, "f")[6 * index + 4] = color.g / 0xff;
        __classPrivateFieldGet(this, _CanvasPixelsWebGl2_xyzRgbValues, "f")[6 * index + 5] = color.b / 0xff;
    }
    takeSnapshot() {
        // TODO: ???
        return new CanvasPixelsWebGl2Snapshot();
    }
    onWindowResize() {
        // TODO: ???
    }
    render() {
        // TODO: ???
        // TODO: REWORK
        const gl = __classPrivateFieldGet(this, _CanvasPixelsWebGl2_gl, "f");
        gl.useProgram(__classPrivateFieldGet(this, _CanvasPixelsWebGl2_pixelsProgram, "f"));
        gl.bufferData(gl.ARRAY_BUFFER, __classPrivateFieldGet(this, _CanvasPixelsWebGl2_xyzRgbValues, "f"), gl.DYNAMIC_DRAW);
        gl.drawArrays(gl.POINTS, 0, __classPrivateFieldGet(this, _CanvasPixelsWebGl2_length, "f"));
    }
}
_CanvasPixelsWebGl2_length = new WeakMap(), _CanvasPixelsWebGl2_xyzRgbValues = new WeakMap(), _CanvasPixelsWebGl2_gl = new WeakMap(), _CanvasPixelsWebGl2_pixelsProgram = new WeakMap();
