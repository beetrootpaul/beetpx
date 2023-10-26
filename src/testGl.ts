import { HtmlTemplate } from "./HtmlTemplate";
import { Loading } from "./Loading";

export function testGl(): void {
  new Loading(HtmlTemplate.selectors.display).showApp();

  const canvas = document.querySelector<HTMLCanvasElement>(
    HtmlTemplate.selectors.canvas,
  );
  if (!canvas) throw Error("lol1");

  canvas.width = 16;
  canvas.height = 16;
  canvas.style.backgroundColor = "grey";

  const gl = canvas.getContext("webgl2");
  if (!gl) throw "lol2";

  const compileProgram = ({
    vertexShader,
    fragmentShader,
  }: {
    vertexShader: string;
    fragmentShader: string;
  }): WebGLProgram => {
    // Compile vertex shader
    const vs: WebGLShader | null = gl.createShader(gl.VERTEX_SHADER);
    if (!vs) throw "lol3";
    gl.shaderSource(vs, vertexShader);
    gl.compileShader(vs);

    // Compile fragment shader
    const fs = gl.createShader(gl.FRAGMENT_SHADER);
    if (!fs) throw "lol4";
    gl.shaderSource(fs, fragmentShader);
    gl.compileShader(fs);

    // Create and launch the WebGL program
    const program = gl.createProgram();
    if (!program) throw "lol5";
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    // Clear the canvas
    gl.clear(gl.COLOR_BUFFER_BIT);
    return program;
  };

  const pixelsProgram = compileProgram({
    vertexShader: `
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
    fragmentShader: `
      precision mediump float;
      varying vec4 v_color;
      void main() {
          gl_FragColor = v_color;
      }
    `,
  });

  const w = canvas.width;
  const h = canvas.height;

  const pixels = Array.from({ length: w * h }).map((_, i) => [
    i % h,
    Math.floor(i / h),
    "#baab00",
  ]) as [number, number, string][];

  const hex2rgb = (hex: string): [number, number, number] => {
    return [
      parseInt(hex.slice(1, 3), 16) / 255,
      parseInt(hex.slice(3, 5), 16) / 255,
      parseInt(hex.slice(5, 8), 16) / 255,
    ];
  };

  const normalize = (x1: number, y1: number): [number, number, number] => {
    return [((x1 + 0.5) / w) * 2 - 1, ((y1 + 0.5) / h) * 2 - 1, 0];
  };

  function toPointColors(pixels: [number, number, string][]) {
    return new Float32Array([
      ...pixels
        .map(([x, y, hex]) => [...normalize(x, y), ...hex2rgb(hex)])
        .flat(),
    ]);
  }

  gl.useProgram(pixelsProgram);
  const FSIZE = toPointColors(pixels).BYTES_PER_ELEMENT;

  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());

  // Bind the attribute position to the 1st, 2nd and 3rd floats in every chunk of 6 floats in the buffer
  const position = gl.getAttribLocation(pixelsProgram, "position");
  gl.vertexAttribPointer(
    position, // target
    3, // interleaved data size
    gl.FLOAT, // type
    false, // normalize
    FSIZE * 6, // stride (chunk size)
    0, // offset (position of interleaved data in chunk)
  );
  gl.enableVertexAttribArray(position);

  // Bind the attribute color to the 3rd, 4th and 5th float in every chunk
  const color = gl.getAttribLocation(pixelsProgram, "color");
  gl.vertexAttribPointer(
    color, // target
    3, // interleaved chunk size
    gl.FLOAT, // type
    false, // normalize
    FSIZE * 6, // stride
    FSIZE * 3, // offset
  );
  gl.enableVertexAttribArray(color);

  const size = gl.getUniformLocation(pixelsProgram, "size");
  gl.uniform1f(size, 1);

  let lol = 7;
  let prevChanged = 0;

  let delta: DOMHighResTimeStamp = 1;
  let prevT: DOMHighResTimeStamp = 1;

  function tick(currentTimeMillis: DOMHighResTimeStamp) {
    delta = currentTimeMillis - prevT;
    prevT = currentTimeMillis;

    if (!gl) throw Error("lolgl");

    lol = (lol + 0.01 * delta) % w;

    (
      [
        [0, 0, "#ff0000"],
        [1, 1, "#ffaa00"],
        [2, 2, "#ffff00"],
        [3, 3, "#00ff00"],
        [4, 4, "#00ffaa"],
        [5, 5, "#00ffff"],
        [6, 6, "#0000ff"],
        [lol, 7, "#ff00aa"],
        [8, 8, "#ff00ff"],
        [15, 15, "#400f8b"],
      ] as [number, number, string][]
    ).forEach(([x, y, c]) => {
      if (y === 7) {
        pixels[prevChanged]![2] = "#baab00";
        prevChanged = Math.floor(y) * w + Math.floor(x);
        pixels[prevChanged]![2] = c;
      } else {
        pixels[Math.floor(y) * w + Math.floor(x)]![2] = c;
      }
    });

    gl.useProgram(pixelsProgram);

    gl.bufferData(gl.ARRAY_BUFFER, toPointColors(pixels), gl.DYNAMIC_DRAW);

    gl.drawArrays(gl.POINTS, 0, pixels.length);

    requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}
