import { BeetPx } from "./BeetPx";

//
// context: fixedTimestep
// test:    valid values
//

BeetPx.start({ fixedTimestep: "30fps" });
BeetPx.start({ fixedTimestep: "60fps" });

//
// context: fixedTimestep
// test:    invalid values
//

// @ts-expect-error
BeetPx.start({ fixedTimestep: "0fps" });
// @ts-expect-error
BeetPx.start({ fixedTimestep: "59fps" });
// @ts-expect-error
BeetPx.start({ fixedTimestep: "120fps" });

// @ts-expect-error
BeetPx.start({ fixedTimestep: 30 });
// @ts-expect-error
BeetPx.start({ fixedTimestep: 60 });

// @ts-expect-error
BeetPx.start({ fixedTimestep: null });

//
// context: canvasSize
// test:    valid values
//

BeetPx.start({ canvasSize: "64x64" });
BeetPx.start({ canvasSize: "128x128" });
BeetPx.start({ canvasSize: "256x256" });

//
// context: canvasSize
// test:    invalid values
//

// @ts-expect-error
BeetPx.start({ canvasSize: "1x1" });
// @ts-expect-error
BeetPx.start({ canvasSize: "512x512" });
// @ts-expect-error
BeetPx.start({ canvasSize: "1980x1080" });

// @ts-expect-error
BeetPx.start({ canvasSize: 64 });
// @ts-expect-error
BeetPx.start({ canvasSize: 128 });
// @ts-expect-error
BeetPx.start({ canvasSize: 256 });

// @ts-expect-error
BeetPx.start({ canvasSize: null });
