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

  const gl = canvas.getContext("webgl");
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
  /*

  const gridProgram: WebGLProgram = compileProgram({
    vertexShader: `
attribute vec4 position;
void main() {
  gl_Position = position;
}
`,

    fragmentShader: `
precision mediump float;
uniform float size;

void main() {
  if(
   mod(gl_FragCoord.x,size)<1.0 ||
   mod(gl_FragCoord.y,size)<1.0
  ){
    gl_FragColor = vec4(0.0, 0.0, 0.0, 0.8);
  }else {discard;}                      
}
`,
  });
  */

  const drawingProgram = compileProgram({
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

  const pixels = [
    [0, 0, "#ff0000"],
    [1, 1, "#ffaa00"],
    [2, 2, "#ffff00"],
    [3, 3, "#00ff00"],
    [4, 4, "#00ffaa"],
    [5, 5, "#00ffff"],
    [6, 6, "#0000ff"],
    [7, 7, "#ff00aa"],
    [8, 8, "#ff00ff"],
    [15, 15, "#400f8b"],
  ] as [number, number, string][];

  const hex2rgb = (hex: string): [number, number, number] => {
    return [
      parseInt(hex.slice(1, 3), 16) / 255,
      parseInt(hex.slice(3, 5), 16) / 255,
      parseInt(hex.slice(5, 8), 16) / 255,
    ];
  };

  const w = canvas.width;
  const h = canvas.height;
  const normalize = (x1: number, y1: number): [number, number, number] => {
    // const mid = 8 / 2;
    // const x = (cx - mid) / mid + 1 / 8;
    // const y = (mid - cy) / mid - 1 / 8;
    // return [x, y, 0];
    return [
      ((Math.floor(x1) + 0.5) / w) * 2 - 1,
      ((Math.floor(y1) + 0.5) / h) * 2 - 1,
      0,
    ];
  };

  const pointsColors = new Float32Array([
    ...pixels
      .map(([x, y, hex]) => [...normalize(x, y), ...hex2rgb(hex)])
      .flat(),
  ]);

  gl.useProgram(drawingProgram);
  const FSIZE = pointsColors.BYTES_PER_ELEMENT;

  // Create a buffer object
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

  // TODO: use gl.DYNAMIC_DRAW instead?
  gl.bufferData(gl.ARRAY_BUFFER, pointsColors, gl.DYNAMIC_DRAW);

  // Bind the attribute position to the 1st, 2nd and 3rd floats in every chunk of 6 floats in the buffer
  const position = gl.getAttribLocation(drawingProgram, "position");
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
  const color = gl.getAttribLocation(drawingProgram, "color");
  gl.vertexAttribPointer(
    color, // target
    3, // interleaved chunk size
    gl.FLOAT, // type
    false, // normalize
    FSIZE * 6, // stride
    FSIZE * 3, // offset
  );
  gl.enableVertexAttribArray(color);

  const size = gl.getUniformLocation(drawingProgram, "size");
  gl.uniform1f(size, 1);

  gl.drawArrays(gl.POINTS, 0, pixels.length);

  let lol = 7;

  let delta: DOMHighResTimeStamp = 1;
  let prevT: DOMHighResTimeStamp = 1;

  function tick(currentTimeMillis: DOMHighResTimeStamp) {
    delta = currentTimeMillis - prevT;
    prevT = currentTimeMillis;

    if (!gl) throw Error("lolgl");

    lol = (lol + 0.01 * delta) % w;

    const pixels = [
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
    ] as [number, number, string][];
    const pointsColors = new Float32Array([
      ...pixels
        .map(([x, y, hex]) => [...normalize(x, y), ...hex2rgb(hex)])
        .flat(),
    ]);

    gl.useProgram(drawingProgram);
    const FSIZE = pointsColors.BYTES_PER_ELEMENT;

    // Create a buffer object
    // const buffer = gl.createBuffer();
    // gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

    // TODO: use gl.DYNAMIC_DRAW instead?
    gl.bufferData(gl.ARRAY_BUFFER, pointsColors, gl.DYNAMIC_DRAW);

    // Bind the attribute position to the 1st, 2nd and 3rd floats in every chunk of 6 floats in the buffer
    const position = gl.getAttribLocation(drawingProgram, "position");
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
    const color = gl.getAttribLocation(drawingProgram, "color");
    gl.vertexAttribPointer(
      color, // target
      3, // interleaved chunk size
      gl.FLOAT, // type
      false, // normalize
      FSIZE * 6, // stride
      FSIZE * 3, // offset
    );
    gl.enableVertexAttribArray(color);

    const size = gl.getUniformLocation(drawingProgram, "size");
    gl.uniform1f(size, 1);

    gl.drawArrays(gl.POINTS, 0, pixels.length);

    requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}
