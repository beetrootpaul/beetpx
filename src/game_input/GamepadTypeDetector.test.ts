import { describe, expect, test } from "@jest/globals";
import { GamepadTypeDetector } from "./GamepadTypeDetector";

describe("GamepadTypeDetector", () => {
  [
    // macOS Ventura 13.5.2 (Apple M1 Max), Arc 1.13.1 (42579), Chromium Engine Version 118.0.5993.88
    // macOS Ventura 13.5.2 (Apple M1 Max), Brave 1.59.122 Chromium: 118.0.5993.96 (Official Build) (arm64)
    // macOS Ventura 13.5.2 (Apple M1 Max), Chrome 118.0.5993.88 (Official Build) (arm64)
    // macOS Ventura 13.5.2 (Apple M1 Max), Edge 118.0.2088.61 (Official build) (arm64)
    // macOS Ventura 13.5.2 (Apple M1 Max), Opera One (version: 103.0.4928.34) (arm64)
    // macOS Ventura 13.5.2 (Apple M1 Max), Vivaldi 6.2.3105.58 (Stable channel) (arm64)
    "Xbox Wireless Controller (STANDARD GAMEPAD Vendor: 045e Product: 02fd)",
    // macOS Ventura 13.5.2 (Apple M1 Max), Firefox 118.0.2 (64-bit)
    "45e-2fd-Xbox Wireless Controller",
    // macOS Ventura 13.5.2 (Apple M1 Max), Safari 16.6 (18615.3.12.11.2)
    "Xbox Wireless Controller Extended Gamepad",
  ].forEach((id) => {
    test(`Xbox (id ="${id}")`, () => {
      expect(GamepadTypeDetector.detect(gamepad(id))).toEqual("xbox");
    });
  });

  [
    // macOS Ventura 13.5.2 (Apple M1 Max), Arc 1.13.1 (42579), Chromium Engine Version 118.0.5993.88
    // macOS Ventura 13.5.2 (Apple M1 Max), Brave 1.59.122 Chromium: 118.0.5993.96 (Official Build) (arm64)
    // macOS Ventura 13.5.2 (Apple M1 Max), Chrome 118.0.5993.88 (Official Build) (arm64)
    // macOS Ventura 13.5.2 (Apple M1 Max), Edge 118.0.2088.61 (Official build) (arm64)
    // macOS Ventura 13.5.2 (Apple M1 Max), Opera One (version: 103.0.4928.34) (arm64)
    // macOS Ventura 13.5.2 (Apple M1 Max), Vivaldi 6.2.3105.58 (Stable channel) (arm64)
    "DualSense Wireless Controller (STANDARD GAMEPAD Vendor: 054c Product: 0ce6)",
    // macOS Ventura 13.5.2 (Apple M1 Max), Firefox 118.0.2 (64-bit)
    "54c-ce6-DualSense Wireless Controller",
    // macOS Ventura 13.5.2 (Apple M1 Max), Safari 16.6 (18615.3.12.11.2)
    "DualSense Wireless Controller Extended Gamepad",
  ].forEach((id) => {
    test(`DualSense (id ="${id}")`, () => {
      expect(GamepadTypeDetector.detect(gamepad(id))).toEqual("dualsense");
    });
  });

  test("other", () => {
    expect(GamepadTypeDetector.detect(gamepad("anything unexpected"))).toEqual(
      "other",
    );
  });
});

function gamepad(id: string): Gamepad {
  return {
    id,
    index: 0,
    connected: true,
    mapping: "",
    axes: [],
    buttons: [],
    hapticActuators: [],
    vibrationActuator: null,
    timestamp: 1,
  };
}
