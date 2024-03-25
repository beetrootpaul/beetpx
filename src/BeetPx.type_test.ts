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
// context: gameCanvasSize
// test:    valid values
//

BeetPx.init({ config: { gameCanvasSize: "64x64" } });
BeetPx.init({ config: { gameCanvasSize: "128x128" } });
BeetPx.init({ config: { gameCanvasSize: "256x256" } });

//
// context: gameCanvasSize
// test:    invalid values
//

// @ts-expect-error
BeetPx.init({ config: { gameCanvasSize: "1x1" } });
// @ts-expect-error
BeetPx.init({ config: { gameCanvasSize: "512x512" } });
// @ts-expect-error
BeetPx.init({ config: { gameCanvasSize: "1980x1080" } });

// @ts-expect-error
BeetPx.init({ config: { gameCanvasSize: 64 } });
// @ts-expect-error
BeetPx.init({ config: { gameCanvasSize: 128 } });
// @ts-expect-error
BeetPx.init({ config: { gameCanvasSize: 256 } });

// @ts-expect-error
BeetPx.init({ config: { gameCanvasSize: null } });
