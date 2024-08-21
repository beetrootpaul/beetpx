import { BeetPx, BpxEngineConfig } from "./";

const anyConfig: BpxEngineConfig = {
  gameId: "any-id",
};

//
// context: fixedTimestep
// test:    valid values
//

BeetPx.start({ ...anyConfig, fixedTimestep: "30fps" });
BeetPx.start({ ...anyConfig, fixedTimestep: "60fps" });

//
// context: fixedTimestep
// test:    invalid values
//

// @ts-expect-error
BeetPx.start({ ...anyConfig, fixedTimestep: "0fps" });
// @ts-expect-error
BeetPx.start({ ...anyConfig, fixedTimestep: "59fps" });
// @ts-expect-error
BeetPx.start({ ...anyConfig, fixedTimestep: "120fps" });

// @ts-expect-error
BeetPx.start({ ...anyConfig, fixedTimestep: 30 });
// @ts-expect-error
BeetPx.start({ ...anyConfig, fixedTimestep: 60 });

// @ts-expect-error
BeetPx.start({ ...anyConfig, fixedTimestep: null });

//
// context: canvasSize
// test:    valid values
//

BeetPx.start({ ...anyConfig, canvasSize: "64x64" });
BeetPx.start({ ...anyConfig, canvasSize: "128x128" });
BeetPx.start({ ...anyConfig, canvasSize: "256x256" });
BeetPx.start({ ...anyConfig, canvasSize: "192x108" });

//
// context: canvasSize
// test:    invalid values
//

// @ts-expect-error
BeetPx.start({ ...anyConfig, canvasSize: "1x1" });
// @ts-expect-error
BeetPx.start({ ...anyConfig, canvasSize: "512x512" });
// @ts-expect-error
BeetPx.start({ ...anyConfig, canvasSize: "1980x1080" });

// @ts-expect-error
BeetPx.start({ ...anyConfig, canvasSize: 64 });
// @ts-expect-error
BeetPx.start({ ...anyConfig, canvasSize: 128 });
// @ts-expect-error
BeetPx.start({ ...anyConfig, canvasSize: 256 });

// @ts-expect-error
BeetPx.start({ ...anyConfig, canvasSize: null });
