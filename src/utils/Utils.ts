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

/////////////////////////////////////////////////////////////////////////////

export class BpxUtils {
  static assertUnreachable = assertUnreachable;
  static booleanChangingEveryNthFrame = booleanChangingEveryNthFrame;
  static clamp = clamp;
  static drawTextWithOutline = drawTextWithOutline;
  static identity = identity;
  static isDefined = isDefined;
  static lerp = lerp;
  static mod = mod;
  static noop = noop;
  static offset4Directions = offset4Directions;
  static offset8Directions = offset8Directions;
  static randomElementOf = randomElementOf;
  static range = range;
  static repeatEachElement = repeatEachElement;
  static throwError = throwError;
  static trigAtan2 = trigAtan2;
  static trigCos = trigCos;
  static trigSin = trigSin;
  static wait = wait;
}

/////////////////////////////////////////////////////////////////////////////

export const u_ = BpxUtils;
