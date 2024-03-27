import { BeetPx } from "./BeetPx";

//
// context: fixedTimestep
// test:    valid values
//

BeetPx.init({ config: { fixedTimestep: "30fps" } });
BeetPx.init({ config: { fixedTimestep: "60fps" } });

//
// context: fixedTimestep
// test:    invalid values
//

// @ts-expect-error
BeetPx.init({ config: { fixedTimestep: "0fps" } });
// @ts-expect-error
BeetPx.init({ config: { fixedTimestep: "59fps" } });
// @ts-expect-error
BeetPx.init({ config: { fixedTimestep: "120fps" } });

// @ts-expect-error
BeetPx.init({ config: { fixedTimestep: 30 } });
// @ts-expect-error
BeetPx.init({ config: { fixedTimestep: 60 } });

// @ts-expect-error
BeetPx.init({ config: { fixedTimestep: null } });

//
// context: canvasSize
// test:    valid values
//

BeetPx.init({ config: { canvasSize: "64x64" } });
BeetPx.init({ config: { canvasSize: "128x128" } });
BeetPx.init({ config: { canvasSize: "256x256" } });

//
// context: canvasSize
// test:    invalid values
//

// @ts-expect-error
BeetPx.init({ config: { canvasSize: "1x1" } });
// @ts-expect-error
BeetPx.init({ config: { canvasSize: "512x512" } });
// @ts-expect-error
BeetPx.init({ config: { canvasSize: "1980x1080" } });

// @ts-expect-error
BeetPx.init({ config: { canvasSize: 64 } });
// @ts-expect-error
BeetPx.init({ config: { canvasSize: 128 } });
// @ts-expect-error
BeetPx.init({ config: { canvasSize: 256 } });

// @ts-expect-error
BeetPx.init({ config: { canvasSize: null } });
