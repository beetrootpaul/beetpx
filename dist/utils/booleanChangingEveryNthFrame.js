import { BeetPx } from "../";
export function booleanChangingEveryNthFrame(n, opts) {
    return n > 0
        ? (opts?.onGamePause === "ignore"
            ? BeetPx.frameNumber
            : BeetPx.frameNumberOutsidePause) %
            (n * 2) <
            n
        : true;
}
//# sourceMappingURL=booleanChangingEveryNthFrame.js.map