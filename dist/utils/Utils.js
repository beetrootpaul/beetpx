import { assertUnreachable } from "./assertUnreachable";
import { booleanChangingEveryNthFrame } from "./booleanChangingEveryNthFrame";
import { clamp } from "./clamp";
import { drawTextWithOutline } from "./drawTextWithOutline";
import { identity } from "./identity";
import { isDefined } from "./isDefined";
import { lerp } from "./lerp";
import { mod } from "./mod";
import { noop } from "./noop";
import { offset4Directions } from "./offset4Directions";
import { offset8Directions } from "./offset8Directions";
import { randomElementOf } from "./randomElementOf";
import { range } from "./range";
import { repeatEachElement } from "./repeatEachElement";
import { throwError } from "./throwError";
import { trigAtan2 } from "./trigAtan2";
import { trigCos } from "./trigCos";
import { trigSin } from "./trigSin";
import { wait } from "./wait";

export class BpxUtils {
}
BpxUtils.assertUnreachable = assertUnreachable;
BpxUtils.booleanChangingEveryNthFrame = booleanChangingEveryNthFrame;
BpxUtils.clamp = clamp;
BpxUtils.drawTextWithOutline = drawTextWithOutline;
BpxUtils.identity = identity;
BpxUtils.isDefined = isDefined;
BpxUtils.lerp = lerp;
BpxUtils.mod = mod;
BpxUtils.noop = noop;
BpxUtils.offset4Directions = offset4Directions;
BpxUtils.offset8Directions = offset8Directions;
BpxUtils.randomElementOf = randomElementOf;
BpxUtils.range = range;
BpxUtils.repeatEachElement = repeatEachElement;
BpxUtils.throwError = throwError;
BpxUtils.trigAtan2 = trigAtan2;
BpxUtils.trigCos = trigCos;
BpxUtils.trigSin = trigSin;
BpxUtils.wait = wait;

export const u_ = BpxUtils;
