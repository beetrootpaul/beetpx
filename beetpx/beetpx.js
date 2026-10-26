// The JavaScript part of the BeetPx web platform. It implements the procs that
// `platform_js.odin` imports, and runs the game's WASM with them and with the
// imports of Odin's `odin.js`, which has to be loaded before this file.
(function () {
  "use strict";

  // How often a hot reload build checks whether its WASM file changed.
  const HOT_RELOAD_CHECK_INTERVAL_MS = 500;

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
    // TODO: Throw an error if this fails?
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

    // TODO: Throw an error if this fails?
    const offscreenContext = offscreenCanvas.getContext("2d", {
      colorSpace: "srgb",
      // https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas#turn_off_transparency
      alpha: false,
    });

    // TODO: Fill the canvas black here, instead of in `_platform_start`?

    if (!htmlContext || !offscreenContext) {
      return null;
    }

    // TODO: Make it configurable?
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

  // Runs the game's WASM. Returns a promise, rejected if the game fails to
  // start.
  //
  // A hot reload build (`-define:BPX_HOT=true`) checks the WASM file for
  // changes, and swaps the running module for the new one, passing the state
  // over to it.
  const runWasm = async (wasmPath) => {
    // Kept across module swaps, so that the `<canvas>` is set up only once.
    let canvas = null;

    // Starts a module: runs its `main`, which starts the game.
    const startModule = (wasmModule) => {
      // Gives the procs below access to the WASM memory.
      const wasmMemoryInterface = new window.odin.WasmMemoryInterface();
      wasmMemoryInterface.setIntSize(4);

      // Implements the `foreign beetpx_js` block of `platform_js.odin`.
      const beetpxImports = {
        // TODO: Review this implementation.
        html_canvas_init: (idPtr, idLen, width, height) => {
          const id = wasmMemoryInterface.loadString(idPtr, idLen);
          const htmlCanvas = document.getElementById(id);
          if (!(htmlCanvas instanceof HTMLCanvasElement)) {
            return false;
          }
          if (
            canvas?.htmlCanvas !== htmlCanvas ||
            canvas.width !== width ||
            canvas.height !== height
          ) {
            canvas = {
              htmlCanvas,
              width,
              height,
              render: setUpHtmlCanvas(htmlCanvas, width, height),
            };
          }
          return canvas.render !== null;
        },
        // TODO: Review this implementation.
        html_canvas_render: (bytesPtr, bytesLen) => {
          // A view on the WASM memory, not a copy. It is created anew on
          // every call, because the memory's buffer changes when it grows.
          canvas.render(
            new Uint8ClampedArray(
              wasmMemoryInterface.memory.buffer,
              bytesPtr,
              bytesLen,
            ),
          );
        },
      };

      const instance = new WebAssembly.Instance(wasmModule, {
        ...window.odin.setupDefaultImports(wasmMemoryInterface),
        beetpx: beetpxImports,
      });
      const exports = instance.exports;
      wasmMemoryInterface.setExports(exports);
      wasmMemoryInterface.setMemory(exports.memory);

      exports._start();

      return {
        exports,
        memory: exports.memory,
        // The Odin context, which every exported Odin proc takes last.
        ctx: exports.default_context_ptr(),
      };
    };

    const fetchWasmModule = async () => {
      const response = await fetch(wasmPath, { cache: "no-store" });
      if (!response.ok) {
        throw new Error(`Failed to fetch '${wasmPath}': ${response.status}`);
      }
      return WebAssembly.compile(await response.arrayBuffer());
    };

    let running = startModule(await fetchWasmModule());

    // Calls the running module's `step` once per animation frame.
    let prevTimestamp = undefined;
    const onAnimationFrame = (timestamp) => {
      prevTimestamp ??= timestamp;
      const deltaS = (timestamp - prevTimestamp) * 0.001;
      prevTimestamp = timestamp;

      if (!running.exports.step(deltaS, running.ctx)) {
        running.exports._end();
        return;
      }
      window.requestAnimationFrame(onAnimationFrame);
    };

    if (running.exports.bpx_hot_load) {
      running.exports.bpx_hot_load(0, running.ctx);
      watchForHotReload(wasmPath, async () => {
        const wasmModule = await fetchWasmModule();

        // Everything below runs between two animation frames.
        const prev = running;
        const size = prev.exports.bpx_hot_save(prev.ctx);
        const ptr = prev.exports.bpx_hot_buffer(size, prev.ctx);
        // A copy, since the snapshot moves to another module's memory.
        const snapshot = new Uint8Array(prev.memory.buffer, ptr, size).slice();

        // If the new module fails to start, the previous one keeps running.
        const next = startModule(wasmModule);
        prev.exports.bpx_hot_unload(prev.ctx);
        running = next;

        const nextPtr = next.exports.bpx_hot_buffer(size, next.ctx);
        new Uint8Array(next.memory.buffer, nextPtr, size).set(snapshot);
        next.exports.bpx_hot_load(size, next.ctx);
      });
    }

    window.requestAnimationFrame(onAnimationFrame);
  };

  // Calls `onChange` whenever the file at `path` changes, as told by its
  // `Last-Modified` and `Content-Length` headers. A failed `onChange` is not
  // retried until the file changes again.
  //
  // TODO: Get notified by the dev server instead, once there is one.
  const watchForHotReload = (path, onChange) => {
    const fileVersion = async () => {
      const response = await fetch(path, { method: "HEAD", cache: "no-store" });
      if (!response.ok) {
        return null;
      }
      return [
        response.headers.get("Last-Modified"),
        response.headers.get("Content-Length"),
      ].join(" ");
    };

    let knownVersion = null;
    const check = async () => {
      try {
        const version = await fileVersion();
        if (version !== null && version !== knownVersion) {
          const isFirstCheck = knownVersion === null;
          knownVersion = version;
          if (!isFirstCheck) {
            console.log("BeetPx: reloading", path);
            await onChange();
          }
        }
      } catch (err) {
        console.error("BeetPx: hot reload failed:", err);
      }
      window.setTimeout(check, HOT_RELOAD_CHECK_INTERVAL_MS);
    };
    check();
  };

  window.beetpx = {
    runWasm: runWasm,
  };
})();
