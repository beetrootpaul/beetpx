import { BeetPx } from "./BeetPx";

//
// context: fixedTimestep
// test:    valid values
//

BeetPx.init({ fixedTimestep: "30fps" });
BeetPx.init({ fixedTimestep: "60fps" });

//
// context: fixedTimestep
// test:    invalid values
//

// @ts-expect-error
BeetPx.init({ fixedTimestep: "0fps" });
// @ts-expect-error
BeetPx.init({ fixedTimestep: "59fps" });
// @ts-expect-error
BeetPx.init({ fixedTimestep: "120fps" });

// @ts-expect-error
BeetPx.init({ fixedTimestep: 30 });
// @ts-expect-error
BeetPx.init({ fixedTimestep: 60 });

// @ts-expect-error
BeetPx.init({ fixedTimestep: null });

//
// context: canvasSize
// test:    valid values
//

BeetPx.init({ canvasSize: "64x64" });
BeetPx.init({ canvasSize: "128x128" });
BeetPx.init({ canvasSize: "256x256" });

//
// context: canvasSize
// test:    invalid values
//

// @ts-expect-error
BeetPx.init({ canvasSize: "1x1" });
// @ts-expect-error
BeetPx.init({ canvasSize: "512x512" });
// @ts-expect-error
BeetPx.init({ canvasSize: "1980x1080" });

// @ts-expect-error
BeetPx.init({ canvasSize: 64 });
// @ts-expect-error
BeetPx.init({ canvasSize: 128 });
// @ts-expect-error
BeetPx.init({ canvasSize: 256 });

// @ts-expect-error
BeetPx.init({ canvasSize: null });
