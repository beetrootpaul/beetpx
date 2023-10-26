import { BpxSolidColor } from "../../Color";
import { u_ } from "../../Utils";
import { BpxVector2d } from "../../Vector2d";
import { CanvasPixels } from "./CanvasPixels";
import { CanvasPixelsSnapshot } from "./CanvasPixelsSnapshot";
import { CanvasPixelsWebGl2Snapshot } from "./CanvasPixelsWebGl2Snapshot";

// TODO: PERFORMANCE IS WORSE FOR THIS ONE. LETS REMOVE ABILITY TO CHOOSE WEBGL2
export class CanvasPixelsWebGl2 extends CanvasPixels {
  readonly #length: number;
  readonly #xyzRgbValues: Float32Array;

  readonly #gl: WebGL2RenderingContext;
  readonly #pixelsProgram: WebGLProgram;

  constructor(
    canvasSize: BpxVector2d,
    htmlCanvas: HTMLCanvasElement,
    htmlCanvasBackground: BpxSolidColor,
  ) {
    super(canvasSize);

    this.#length = canvasSize.x * canvasSize.y;
    // TODO: REWORK
    const hex2rgb = (hex: string): [number, number, number] => {
      return [
        parseInt(hex.slice(1, 3), 16) / 255,
        parseInt(hex.slice(3, 5), 16) / 255,
        parseInt(hex.slice(5, 8), 16) / 255,
      ];
    };
    const normalize = (x1: number, y1: number): [number, number, number] => {
      return [
        ((x1 + 0.5) / canvasSize.x) * 2 - 1,
        ((y1 + 0.5) / canvasSize.y) * 2 - 1,
        0,
      ];
    };
    this.#xyzRgbValues = new Float32Array([
      ...u_
        .range(this.#length)
        .map(
          (_, i) =>
            [i % canvasSize.y, Math.floor(i / canvasSize.y), "#3aab00"] as [
              number,
              number,
              string,
            ],
        )
        .map(([x, y, hex]) => [...normalize(x, y), ...hex2rgb(hex)])
        .flat(),
    ]);

    // TODO: ???
    // canvas.width = 16;
    // canvas.height = 16;
    // canvas.style.backgroundColor = "grey";
    // this.#htmlCanvas = htmlCanvas;
    htmlCanvas.style.backgroundColor = htmlCanvasBackground.asRgbCssHex();

    const gl =
      htmlCanvas.getContext("webgl2", {
        // we allow transparency in order ot make background color visible around the game itself
        alpha: true,
      }) ??
      u_.throwError(
        "CanvasPixelsWebGl2: Was unable to obtain 'webgl2' context from <canvas>",
      );
    this.#gl = gl;

    const vertexShader: WebGLShader | null =
      gl.createShader(gl.VERTEX_SHADER) ??
      u_.throwError("CanvasPixelsWebGl2: failed to create a vertex shader");
    gl.shaderSource(
      vertexShader,
      `
        attribute vec4 position;
        attribute vec4 color;
        varying vec4 v_color;
        uniform float size;
        void main() {
            gl_Position = position;
            v_color = color;
            gl_PointSize = size;
        }
      `,
    );
    gl.compileShader(vertexShader);

    const fragmentShader =
      gl.createShader(gl.FRAGMENT_SHADER) ??
      u_.throwError("CanvasPixelsWebGl2: failed to create a fragment shader");
    gl.shaderSource(
      fragmentShader,
      `
      precision mediump float;
      varying vec4 v_color;
      void main() {
          gl_FragColor = v_color;
      }
    `,
    );
    gl.compileShader(fragmentShader);

    const pixelsProgram =
      gl.createProgram() ??
      u_.throwError("CanvasPixelsWebGl2: failed to create a program");
    this.#pixelsProgram = pixelsProgram;
    gl.attachShader(pixelsProgram, vertexShader);
    gl.attachShader(pixelsProgram, fragmentShader);
    gl.linkProgram(pixelsProgram);

    // TODO: needed?
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(pixelsProgram);

    // TODO: REWORK

    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());

    const xyzRgbElementSize = this.#xyzRgbValues.BYTES_PER_ELEMENT;

    // TODO: REWORK
    // Bind the attribute position to the 1st, 2nd and 3rd floats in every chunk of 6 floats in the buffer
    const position = gl.getAttribLocation(pixelsProgram, "position");
    gl.vertexAttribPointer(
      position, // target
      3, // interleaved data size
      gl.FLOAT, // type
      false, // normalize
      xyzRgbElementSize * 6, // stride (chunk size)
      0, // offset (position of interleaved data in chunk)
    );
    gl.enableVertexAttribArray(position);

    // TODO: REWORK
    // Bind the attribute color to the 3rd, 4th and 5th float in every chunk
    const color = gl.getAttribLocation(pixelsProgram, "color");
    gl.vertexAttribPointer(
      color, // target
      3, // interleaved chunk size
      gl.FLOAT, // type
      false, // normalize
      xyzRgbElementSize * 6, // stride
      xyzRgbElementSize * 3, // offset
    );
    gl.enableVertexAttribArray(color);

    const size = gl.getUniformLocation(pixelsProgram, "size");
    gl.uniform1f(size, 1);
  }

  set(index: number, color: BpxSolidColor): void {
    if (index >= this.#length) {
      throw Error(
        `CanvasPixelsWebGl2: index out of bounds: index = ${index}, maxAllowedIndex = ${
          this.#length - 1
        }`,
      );
    }
    // TODO: ???

    // TODO: DOES IT WORK AT ALL?
    this.#xyzRgbValues[6 * index + 3] = color.r / 0xff;
    this.#xyzRgbValues[6 * index + 4] = color.g / 0xff;
    this.#xyzRgbValues[6 * index + 5] = color.b / 0xff;
  }

  takeSnapshot(): CanvasPixelsSnapshot {
    // TODO: ???
    return new CanvasPixelsWebGl2Snapshot();
  }

  onWindowResize(): void {
    // TODO: ???
  }

  render(): void {
    // TODO: ???

    // TODO: REWORK
    const gl = this.#gl;
    gl.useProgram(this.#pixelsProgram);
    gl.bufferData(gl.ARRAY_BUFFER, this.#xyzRgbValues, gl.DYNAMIC_DRAW);
    gl.drawArrays(gl.POINTS, 0, this.#length);
  }
}
