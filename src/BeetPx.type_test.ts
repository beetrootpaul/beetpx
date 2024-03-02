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
// context: gameCanvasSize
// test:    valid values
//

BeetPx.init({ gameCanvasSize: "64x64" });
BeetPx.init({ gameCanvasSize: "128x128" });
BeetPx.init({ gameCanvasSize: "256x256" });

//
// context: gameCanvasSize
// test:    invalid values
//

// @ts-expect-error
BeetPx.init({ gameCanvasSize: "1x1" });
// @ts-expect-error
BeetPx.init({ gameCanvasSize: "512x512" });
// @ts-expect-error
BeetPx.init({ gameCanvasSize: "1980x1080" });

// @ts-expect-error
BeetPx.init({ gameCanvasSize: 64 });
// @ts-expect-error
BeetPx.init({ gameCanvasSize: 128 });
// @ts-expect-error
BeetPx.init({ gameCanvasSize: 256 });

// @ts-expect-error
BeetPx.init({ gameCanvasSize: null });
