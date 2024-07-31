import { BeetPx } from "../";

export function booleanChangingEveryNthFrame(
  n: number,
  opts?: { onGamePause?: "pause" | "ignore" },
): boolean {
  return n > 0 ?
      (opts?.onGamePause === "ignore" ?
        BeetPx.frameNumber
      : BeetPx.frameNumberOutsidePause) %
        (n * 2) <
        n
    : true;
}
