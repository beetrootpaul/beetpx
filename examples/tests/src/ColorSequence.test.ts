import { describe, expect, test } from "vitest";
import { u_ } from "../../../src";
import { ColorSequence } from "./ColorSequence";

describe("ColorSequence", () => {
  test("the sequence goes through the whole grayscale, then bounces back", () => {
    const cs = new ColorSequence();

    expect(cs.current.cssHex).toBe("#000000");

    cs.next();
    expect(cs.current.cssHex).toBe("#010101");
    cs.next();
    expect(cs.current.cssHex).toBe("#020202");
    u_.range(0xff - 3).forEach(() => {
      cs.next();
    });
    expect(cs.current.cssHex).toBe("#fefefe");
    cs.next();
    expect(cs.current.cssHex).toBe("#ffffff");

    cs.next();
    expect(cs.current.cssHex).toBe("#fefefe");
    cs.next();
    expect(cs.current.cssHex).toBe("#fdfdfd");

    u_.range(0xff - 4).forEach(() => {
      cs.next();
    });
    expect(cs.current.cssHex).toBe("#020202");
    cs.next();
    expect(cs.current.cssHex).toBe("#010101");
    cs.next();
    expect(cs.current.cssHex).toBe("#000000");

    cs.next();
    expect(cs.current.cssHex).toBe("#010101");
    cs.next();
    expect(cs.current.cssHex).toBe("#020202");
  });
});
