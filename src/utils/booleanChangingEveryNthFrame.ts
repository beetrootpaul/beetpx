import { BeetPx } from "../BeetPx";

export function booleanChangingEveryNthFrame(n: number): boolean {
  return n > 0 ? BeetPx.frameNumber % (n * 2) < n : true;
}
