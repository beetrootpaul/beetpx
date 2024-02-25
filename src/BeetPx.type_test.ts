import { AssetsToLoad } from "./assets/AssetLoader";
import { BeetPx } from "./BeetPx";
import { FrameworkOptions } from "./Framework";

const anyFrameworkOptions: FrameworkOptions = {
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

BeetPx.init({ ...anyFrameworkOptions, desiredUpdateFps: 30 }, anyAssetsToLoad);

BeetPx.init({ ...anyFrameworkOptions, desiredUpdateFps: 60 }, anyAssetsToLoad);

//
// context: desiredUpdateFps
// test:    invalid values
//

// @ts-expect-error
BeetPx.init({ ...anyFrameworkOptions, desiredUpdateFps: 0 }, anyAssetsToLoad);

// @ts-expect-error
BeetPx.init({ ...anyFrameworkOptions, desiredUpdateFps: 59 }, anyAssetsToLoad);

// @ts-expect-error
BeetPx.init({ ...anyFrameworkOptions, desiredUpdateFps: 120 }, anyAssetsToLoad);

BeetPx.init(
  // @ts-expect-error
  { ...anyFrameworkOptions, desiredUpdateFps: undefined },
  anyAssetsToLoad,
);

BeetPx.init(
  // @ts-expect-error
  { ...anyFrameworkOptions, desiredUpdateFps: null },
  anyAssetsToLoad,
);

//
// context: gameCanvasSize
// test:    valid values
//

BeetPx.init(
  { ...anyFrameworkOptions, gameCanvasSize: "64x64" },
  anyAssetsToLoad,
);

BeetPx.init(
  { ...anyFrameworkOptions, gameCanvasSize: "128x128" },
  anyAssetsToLoad,
);

BeetPx.init(
  { ...anyFrameworkOptions, gameCanvasSize: "256x256" },
  anyAssetsToLoad,
);

//
// context: gameCanvasSize
// test:    invalid values
//

BeetPx.init(
  // @ts-expect-error
  { ...anyFrameworkOptions, gameCanvasSize: "1x1" },
  anyAssetsToLoad,
);

BeetPx.init(
  // @ts-expect-error
  { ...anyFrameworkOptions, gameCanvasSize: "512x512" },
  anyAssetsToLoad,
);

BeetPx.init(
  // @ts-expect-error
  { ...anyFrameworkOptions, gameCanvasSize: "1980x1080" },
  anyAssetsToLoad,
);

// @ts-expect-error
BeetPx.init({ ...anyFrameworkOptions, gameCanvasSize: null }, anyAssetsToLoad);

BeetPx.init(
  // @ts-expect-error
  { ...anyFrameworkOptions, gameCanvasSize: undefined },
  anyAssetsToLoad,
);

// @ts-expect-error
BeetPx.init({ ...anyFrameworkOptions, gameCanvasSize: 64 }, anyAssetsToLoad);
