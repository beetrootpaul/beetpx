import { AssetsToLoad } from "./assets/AssetLoader";
import { BeetPx } from "./BeetPx";
import { EngineOptions } from "./Engine";

const anyEngineOptions: EngineOptions = {
  gameCanvasSize: "64x64",
  debugFeatures: false,
  desiredUpdateFps: 60,
};

const anyAssetsToLoad: AssetsToLoad = {
  images: [],
  fonts: [],
  jsons: [],
  sounds: [],
};

//
// context: desiredUpdateFps
// test:    valid values
//

BeetPx.init({ ...anyEngineOptions, desiredUpdateFps: 30 }, anyAssetsToLoad);

BeetPx.init({ ...anyEngineOptions, desiredUpdateFps: 60 }, anyAssetsToLoad);

//
// context: desiredUpdateFps
// test:    invalid values
//

// @ts-expect-error
BeetPx.init({ ...anyEngineOptions, desiredUpdateFps: 0 }, anyAssetsToLoad);

// @ts-expect-error
BeetPx.init({ ...anyEngineOptions, desiredUpdateFps: 59 }, anyAssetsToLoad);

// @ts-expect-error
BeetPx.init({ ...anyEngineOptions, desiredUpdateFps: 120 }, anyAssetsToLoad);

BeetPx.init(
  // @ts-expect-error
  { ...anyEngineOptions, desiredUpdateFps: undefined },
  anyAssetsToLoad,
);

BeetPx.init(
  // @ts-expect-error
  { ...anyEngineOptions, desiredUpdateFps: null },
  anyAssetsToLoad,
);

//
// context: gameCanvasSize
// test:    valid values
//

BeetPx.init({ ...anyEngineOptions, gameCanvasSize: "64x64" }, anyAssetsToLoad);

BeetPx.init(
  { ...anyEngineOptions, gameCanvasSize: "128x128" },
  anyAssetsToLoad,
);

BeetPx.init(
  { ...anyEngineOptions, gameCanvasSize: "256x256" },
  anyAssetsToLoad,
);

//
// context: gameCanvasSize
// test:    invalid values
//

BeetPx.init(
  // @ts-expect-error
  { ...anyEngineOptions, gameCanvasSize: "1x1" },
  anyAssetsToLoad,
);

BeetPx.init(
  // @ts-expect-error
  { ...anyEngineOptions, gameCanvasSize: "512x512" },
  anyAssetsToLoad,
);

BeetPx.init(
  // @ts-expect-error
  { ...anyEngineOptions, gameCanvasSize: "1980x1080" },
  anyAssetsToLoad,
);

// @ts-expect-error
BeetPx.init({ ...anyEngineOptions, gameCanvasSize: null }, anyAssetsToLoad);

BeetPx.init(
  // @ts-expect-error
  { ...anyEngineOptions, gameCanvasSize: undefined },
  anyAssetsToLoad,
);

// @ts-expect-error
BeetPx.init({ ...anyEngineOptions, gameCanvasSize: 64 }, anyAssetsToLoad);
