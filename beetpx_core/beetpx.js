// The JavaScript half of the BeetPx web platform. It implements the procs
// which `platform_js.odin` imports from JavaScript, and runs the game's WASM with
// them through Odin's `odin.js`, which has to be loaded before this file.
(function () {
  "use strict";

  // Prepares the `<canvas>` element to present a canvas of the given size.
  // Returns a function which presents the canvas's RGBA8 bytes, or `null` if
  // a 2D context is not available.
  //
  // The page decides the element's CSS size. Its backing store follows that
  // size in device pixels, and the canvas is scaled by the largest whole
  // number that fits, then centered. This way every canvas pixel is the same
  // whole number of device pixels wide and tall. The rest of the element stays
  // transparent, and shows its background color.
  const setUpHtmlCanvas = (htmlCanvas, width, height) => {
    // TODO: Throw error if failed?
    const htmlContext = htmlCanvas.getContext("2d", {
      colorSpace: "srgb",
      // Transparent, so the background color shows around the canvas.
      alpha: true,
    });

    const offscreenCanvas = document
      .createElement("canvas")
      .transferControlToOffscreen();
    offscreenCanvas.width = width;
    offscreenCanvas.height = height;

    // TODO: Throw error if failed?
    const offscreenContext = offscreenCanvas.getContext("2d", {
      colorSpace: "srgb",
      // https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas#turn_off_transparency
      alpha: false,
    });

    // TODO: Initialize as non-transparent here instead of in the `@(init)` call?

    if (!htmlContext || !offscreenContext) {
      return null;
    }

    // TODO: Make it configurable by the user?
    htmlCanvas.style.backgroundColor = "#000000";

    // Resizing the backing store clears the `<canvas>` and resets all
    // settings of its context, so they have to be set again.
    //
    // TODO: Review this implementation.
    const resizeBackingStore = (deviceWidth, deviceHeight) => {
      htmlCanvas.width = deviceWidth;
      htmlCanvas.height = deviceHeight;
      htmlContext.imageSmoothingEnabled = false;
    };

    // TODO: Review this implementation.
    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[entries.length - 1];
      if (entry.devicePixelContentBoxSize) {
        resizeBackingStore(
          entry.devicePixelContentBoxSize[0].inlineSize,
          entry.devicePixelContentBoxSize[0].blockSize,
        );
      } else {
        // The browser does not report the exact size in device pixels, so
        // it is estimated from the size in CSS pixels.
        resizeBackingStore(
          Math.round(
            entry.contentBoxSize[0].inlineSize * window.devicePixelRatio,
          ),
          Math.round(
            entry.contentBoxSize[0].blockSize * window.devicePixelRatio,
          ),
        );
      }
    });
    // TODO: Review this implementation.
    try {
      resizeObserver.observe(htmlCanvas, { box: "device-pixel-content-box" });
    } catch {
      // The browser does not support observing the size in device pixels.
      resizeObserver.observe(htmlCanvas, { box: "content-box" });
    }

    // TODO: Review this implementation.
    return (rgba8Bytes) => {
      offscreenContext.putImageData(
        new ImageData(rgba8Bytes, width, height),
        0,
        0,
      );

      const scale = Math.max(
        1,
        Math.min(
          Math.floor(htmlCanvas.width / width),
          Math.floor(htmlCanvas.height / height),
        ),
      );
      const offsetX = Math.floor((htmlCanvas.width - scale * width) / 2);
      const offsetY = Math.floor((htmlCanvas.height - scale * height) / 2);

      htmlContext.drawImage(
        offscreenCanvas,
        offsetX,
        offsetY,
        scale * width,
        scale * height,
      );
    };
  };

  // Runs the game's WASM. Returns the promise of `odin.runWasm`.
  const runWasm = (wasmPath) => {
    // Gives the procs below access to the WASM memory.
    const wasmMemoryInterface = new window.odin.WasmMemoryInterface();

    let renderCanvas = null;

    // Implements the `foreign beetpx_js` block of `platform_js.odin`.
    const foreignImports = {
      beetpx: {
        // TODO: Review this implementation.
        html_canvas_init: (idPtr, idLen, width, height) => {
          const id = wasmMemoryInterface.loadString(idPtr, idLen);
          const htmlCanvas = document.getElementById(id);
          if (!(htmlCanvas instanceof HTMLCanvasElement)) {
            return false;
          }
          renderCanvas = setUpHtmlCanvas(htmlCanvas, width, height);
          return renderCanvas !== null;
        },
        // TODO: Review this implementation.
        html_canvas_render: (bytesPtr, bytesLen) => {
          // A view on the WASM memory, not a copy. It is created anew on
          // every call, because the memory's buffer changes when it grows.
          renderCanvas(
            new Uint8ClampedArray(
              wasmMemoryInterface.memory.buffer,
              bytesPtr,
              bytesLen,
            ),
          );
        },
      },
    };

    return window.odin.runWasm(
      wasmPath,
      // TODO: What the undefined stands for here?
      undefined,
      foreignImports,
      wasmMemoryInterface,
    );
  };

  window.beetpx = {
    runWasm: runWasm,
  };
})();
