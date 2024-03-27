import { b_ } from "../../../src";
import { DebugView } from "./DebugView";
import { StandardView } from "./StandardView";

let standardView: StandardView | null = null;
let debugView: DebugView | null = null;
let showDebug: boolean = false;

let prevDebugToggleState: boolean = false;
let nextDebugToggleState: boolean = false;

b_.init({
  canvasSize: "128x128",
  fixedTimestep: "60fps",
  debugMode: { available: true },
  assets: ["spritesheet.png"],
}).then(async ({ startGame }) => {
  b_.setOnStarted(() => {
    standardView = new StandardView();
    debugView = new DebugView();
    showDebug = false;

    prevDebugToggleState = false;
    nextDebugToggleState = false;
  });

  b_.setOnUpdate(() => {
    if (showDebug) {
      debugView?.update();
    } else {
      standardView?.update();
    }

    // This whole work with detecting debug toggle button release is here only
    //   because we want to see debug toggle button pressed in standard view
    //   before (on the button release) the view switches to the debug one.
    // If not for that, we could just use `b_.debug` as a condition for
    //   which view to update/draw.
    prevDebugToggleState = nextDebugToggleState;
    nextDebugToggleState = b_
      .getEventsCapturedInLastUpdate()
      .has("debug_toggle");
    if (prevDebugToggleState && !nextDebugToggleState) {
      showDebug = !showDebug;
    }
  });

  b_.setOnDraw(() => {
    if (showDebug) {
      debugView?.draw();
    } else {
      standardView?.draw();
    }
  });

  await startGame();
});
