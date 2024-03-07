import { BeetPx } from "../BeetPx";
export function booleanChangingEveryNthFrame(n) {
    return n > 0 ? BeetPx.frameNumber % (n * 2) < n : true;
}
