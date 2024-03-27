import { b_, rgb_p8_, v_ } from "../../../src";

declare global {
  interface Window {
    PREV_COMMIT: string;
    envType: "prod" | "dev" | undefined;
  }
}

b_.init({
  onDraw() {
    b_.clearCanvas(window.envType === "prod" ? rgb_p8_.wine : rgb_p8_.storm);
    b_.drawText(`PREV_COMMIT=${window.PREV_COMMIT}`, v_(1, 1), rgb_p8_.silver);
    b_.drawText(`envType=${window.envType}`, v_(1, 8), rgb_p8_.silver);
  },
});
