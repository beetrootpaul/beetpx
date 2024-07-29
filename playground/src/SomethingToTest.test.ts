import { describe, expect, test } from "vitest";
import { $u } from "../../src";
import { SomethingToTest } from "./SomethingToTest";

describe("SomethingToTest", () => {
  test("the sequence goes through the whole grayscale, then bounces back", () => {
    const stt = new SomethingToTest();

    expect(stt.current.cssHex).toBe("#000000");

    stt.next();
    expect(stt.current.cssHex).toBe("#010101");
    stt.next();
    expect(stt.current.cssHex).toBe("#020202");
    $u.range(0xff - 3).forEach(() => {
      stt.next();
    });
    expect(stt.current.cssHex).toBe("#fefefe");
    stt.next();
    expect(stt.current.cssHex).toBe("#ffffff");

    stt.next();
    expect(stt.current.cssHex).toBe("#fefefe");
    stt.next();
    expect(stt.current.cssHex).toBe("#fdfdfd");

    $u.range(0xff - 4).forEach(() => {
      stt.next();
    });
    expect(stt.current.cssHex).toBe("#020202");
    stt.next();
    expect(stt.current.cssHex).toBe("#010101");
    stt.next();
    expect(stt.current.cssHex).toBe("#000000");

    stt.next();
    expect(stt.current.cssHex).toBe("#010101");
    stt.next();
    expect(stt.current.cssHex).toBe("#020202");
  });
});
