import { describe, expect, test } from "@jest/globals";
import { BpxVector2d, v_ } from "./Vector2d";

describe("Vector2d", () => {
  test("Symbol.toStringTag", () => {
    const v = v_(12.345, -6789);

    expect(v.toString()).toEqual("[object BpxVector2d]");
  });

  test("Symbol.toPrimitive", () => {
    const v = v_(12.345, -6789);

    // [Symbol.toPrimitive"] called with a hint "default"
    expect("some text " + v).toEqual("some text (12.345,-6789)");

    // [Symbol.toPrimitive"] called with a hint "string"
    expect(`${v}`).toEqual("(12.345,-6789)");
    expect(String(v)).toEqual("(12.345,-6789)");

    // [Symbol.toPrimitive"] called with a hint "number"
    expect(+v).toEqual(NaN);
  });

  test("Symbol.iterator", () => {
    const v = v_(12.345, -6789);

    expect([...v]).toEqual([12.345, -6789]);
  });

  describe("basics", () => {
    test("#min", () => {
      expect(BpxVector2d.min(v_(111, 999), v_(888, 222)).asArray()).toEqual([
        111, 222,
      ]);
      expect(BpxVector2d.min(v_(-111, -999), v_(-888, -222)).asArray()).toEqual(
        [-888, -999],
      );
    });

    test("#max", () => {
      expect(BpxVector2d.max(v_(111, 999), v_(888, 222)).asArray()).toEqual([
        888, 999,
      ]);
      expect(BpxVector2d.max(v_(-111, -999), v_(-888, -222)).asArray()).toEqual(
        [-111, -222],
      );
    });

    test("#minMax", () => {
      expect(
        BpxVector2d.minMax(v_(111, 999), v_(888, 222)).map((v) => v.asArray()),
      ).toEqual([
        [111, 222],
        [888, 999],
      ]);
      expect(
        BpxVector2d.minMax(v_(-111, -999), v_(-888, -222)).map((v) =>
          v.asArray(),
        ),
      ).toEqual([
        [-888, -999],
        [-111, -222],
      ]);
    });

    test("#lerp", () => {
      expect(
        BpxVector2d.lerp(v_(200, -400), v_(100, -300), -0.1).round().asArray(),
      ).toEqual([210, -410]);
      expect(
        BpxVector2d.lerp(v_(200, -400), v_(100, -300), 0).round().asArray(),
      ).toEqual([200, -400]);
      expect(
        BpxVector2d.lerp(v_(200, -400), v_(100, -300), 0.1).round().asArray(),
      ).toEqual([190, -390]);
      expect(
        BpxVector2d.lerp(v_(200, -400), v_(100, -300), 0.9).round().asArray(),
      ).toEqual([110, -310]);
      expect(
        BpxVector2d.lerp(v_(200, -400), v_(100, -300), 1).round().asArray(),
      ).toEqual([100, -300]);
      expect(
        BpxVector2d.lerp(v_(200, -400), v_(100, -300), 1.1).round().asArray(),
      ).toEqual([90, -290]);
    });

    test("#asArray", () => {
      expect(v_(12.345, -6789).asArray()).toEqual([12.345, -6789]);
    });

    test("#magnitude", () => {
      expect(v_(0, 12.34).magnitude()).toEqual(12.34);
      expect(v_(12.34, 0).magnitude()).toEqual(12.34);
      expect(v_(3, 4).magnitude()).toEqual(5);

      expect(v_(1, 1).magnitude()).toBeCloseTo(1.41, 2);
      expect(v_(-1, 1).magnitude()).toBeCloseTo(1.41, 2);
      expect(v_(1, -1).magnitude()).toBeCloseTo(1.41, 2);
      expect(v_(-1, -1).magnitude()).toBeCloseTo(1.41, 2);
    });

    test("#sign", () => {
      expect(v_(12.34, -12.34).sign().asArray()).toEqual([1, -1]);
      expect(v_(-12.34, 12.34).sign().asArray()).toEqual([-1, 1]);
      expect(v_(0, 0).sign().asArray()).toEqual([0, 0]);
    });

    test("#abs", () => {
      expect(v_(12.34, -12.34).abs().asArray()).toEqual([12.34, 12.34]);
      expect(v_(-12.34, 12.34).abs().asArray()).toEqual([12.34, 12.34]);
      expect(v_(0, 0).abs().asArray()).toEqual([0, 0]);
    });

    test("#floor", () => {
      expect(v_(10, 20).floor().asArray()).toEqual([10, 20]);
      expect(v_(10.1, 20.9).floor().asArray()).toEqual([10, 20]);
      expect(v_(-10, -20).floor().asArray()).toEqual([-10, -20]);
      expect(v_(-10.1, -20.9).floor().asArray()).toEqual([-11, -21]);
      expect(v_(0, 0).floor().asArray()).toEqual([0, 0]);
    });

    test("#ceil", () => {
      expect(v_(10, 20).ceil().asArray()).toEqual([10, 20]);
      expect(v_(10.1, 20.9).ceil().asArray()).toEqual([11, 21]);
      expect(v_(-10, -20).ceil().asArray()).toEqual([-10, -20]);
      expect(v_(-10.1, -20.9).ceil().asArray()).toEqual([-10, -20]);
      expect(v_(0, 0).ceil().asArray()).toEqual([0, 0]);
    });

    test("#round", () => {
      expect(v_(10, 20).round().asArray()).toEqual([10, 20]);
      expect(v_(10.1, 20.9).round().asArray()).toEqual([10, 21]);
      expect(v_(-10, -20).round().asArray()).toEqual([-10, -20]);
      expect(v_(-10.1, -20.9).round().asArray()).toEqual([-10, -21]);
      expect(v_(0, 0).round().asArray()).toEqual([0, 0]);
    });

    test("#eq", () => {
      expect(v_(10, -20).eq(v_(10, -20))).toBe(true);
      expect(v_(10, -20).eq(v_(99, -20))).toBe(false);
      expect(v_(10, -20).eq(v_(10, -99))).toBe(false);

      expect(v_(123, 123).eq(123)).toBe(true);
      expect(v_(123, 123).eq(999)).toBe(false);
      expect(v_(123, 999).eq(123)).toBe(false);
      expect(v_(999, 123).eq(123)).toBe(false);
    });

    test("#gt", () => {
      expect(v_(20, -80).gt(v_(10, -90))).toBe(true);
      expect(v_(20, -80).gt(v_(20, -90))).toBe(false);
      expect(v_(20, -80).gt(v_(10, -80))).toBe(false);
    });

    test("#gte", () => {
      expect(v_(20, -80).gte(v_(10, -90))).toBe(true);
      expect(v_(20, -80).gte(v_(20, -80))).toBe(true);
      expect(v_(20, -80).gte(v_(21, -90))).toBe(false);
      expect(v_(20, -80).gte(v_(10, -79))).toBe(false);
    });

    test("#lt", () => {
      expect(v_(20, -80).lt(v_(30, -70))).toBe(true);
      expect(v_(20, -80).lt(v_(20, -70))).toBe(false);
      expect(v_(20, -80).lt(v_(30, -80))).toBe(false);
    });

    test("#lte", () => {
      expect(v_(20, -80).lte(v_(30, -70))).toBe(true);
      expect(v_(20, -80).lte(v_(20, -80))).toBe(true);
      expect(v_(20, -80).lte(v_(19, -70))).toBe(false);
      expect(v_(20, -80).lte(v_(30, -81))).toBe(false);
    });

    test("#clamp", () => {
      expect(v_(20, -1.2).clamp(v_(10, -1.3), v_(30, -1.1)).asArray()).toEqual([
        20, -1.2,
      ]);
      expect(v_(9, -1.4).clamp(v_(10, -1.3), v_(30, -1.1)).asArray()).toEqual([
        10, -1.3,
      ]);
      expect(v_(31, -1.0).clamp(v_(19, -1.3), v_(30, -1.1)).asArray()).toEqual([
        30, -1.1,
      ]);
    });

    test("#mod", () => {
      expect(v_(123.5, -123.5).mod(100).asArray()).toEqual([23.5, 76.5]);
      expect(v_(123.5, -123.5).mod(10, 2).asArray()).toEqual([3.5, 0.5]);
    });

    test("#add", () => {
      expect(v_(11, -222).add(123).asArray()).toEqual([134, -99]);
      expect(v_(11, -222).add(-1, -22).asArray()).toEqual([10, -244]);
    });

    test("#sub", () => {
      expect(v_(11, -222).sub(123).asArray()).toEqual([-112, -345]);
      expect(v_(11, -222).sub(-1, -22).asArray()).toEqual([12, -200]);
    });

    test("#mul", () => {
      expect(v_(11, -222).mul(3).asArray()).toEqual([33, -666]);
      expect(v_(11, -222).mul(-2, -4).asArray()).toEqual([-22, 888]);
    });

    test("#div", () => {
      expect(v_(22, -33).div(11).asArray()).toEqual([2, -3]);
      expect(v_(22, -33).div(-11, 11).asArray()).toEqual([-2, -3]);
    });
  });

  describe("angle <-> vector", () => {
    test("basic vector to angle conversions (right angles)", () => {
      expect(v_(1, 0).toAngle()).toEqual(0);
      expect(v_(123, 0).toAngle()).toEqual(0);
      expect(v_(1.23, 0).toAngle()).toEqual(0);

      expect(v_(0, 1).toAngle()).toEqual(0.25);
      expect(v_(0, 123).toAngle()).toEqual(0.25);
      expect(v_(0, 1.23).toAngle()).toEqual(0.25);

      expect(v_(-1, 0).toAngle()).toEqual(0.5);
      expect(v_(-123, 0).toAngle()).toEqual(0.5);
      expect(v_(-1.23, 0).toAngle()).toEqual(0.5);

      expect(v_(0, -1).toAngle()).toEqual(0.75);
      expect(v_(0, -123).toAngle()).toEqual(0.75);
      expect(v_(0, -1.23).toAngle()).toEqual(0.75);
    });

    test("basic angle to vector conversions (right angles)", () => {
      expect(BpxVector2d.unitFromAngle(0).x).toBeCloseTo(1.0, 15);
      expect(BpxVector2d.unitFromAngle(0).y).toBeCloseTo(0.0, 15);

      expect(BpxVector2d.unitFromAngle(0.25).x).toBeCloseTo(0.0, 15);
      expect(BpxVector2d.unitFromAngle(0.25).y).toBeCloseTo(1.0, 15);

      expect(BpxVector2d.unitFromAngle(0.5).x).toBeCloseTo(-1.0, 15);
      expect(BpxVector2d.unitFromAngle(0.5).y).toBeCloseTo(0.0, 15);

      expect(BpxVector2d.unitFromAngle(-0.25).x).toBeCloseTo(0.0, 15);
      expect(BpxVector2d.unitFromAngle(-0.25).y).toBeCloseTo(-1.0, 15);
    });

    test("conversion back and forth", () => {
      const v = v_(-123, -456);
      expect(BpxVector2d.unitFromAngle(v.toAngle()).x).toBeCloseTo(
        v.x / v.magnitude(),
        14,
      );
      expect(BpxVector2d.unitFromAngle(v.toAngle()).y).toBeCloseTo(
        v.y / v.magnitude(),
        14,
      );
    });
  });
});
