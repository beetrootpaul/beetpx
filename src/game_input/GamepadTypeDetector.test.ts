import { describe, expect, test } from "@jest/globals";
import { GamepadTypeDetector } from "./GamepadTypeDetector";

describe("GamepadTypeDetector", () => {
  [
    // Xbox One controller, macOS Ventura 13.5.2 (Apple M1 Max), Arc 1.13.1 (42579), Chromium Engine Version 118.0.5993.88
    // Xbox One controller, macOS Ventura 13.5.2 (Apple M1 Max), Brave 1.59.122 Chromium: 118.0.5993.96 (Official Build) (arm64)
    // Xbox One controller, macOS Ventura 13.5.2 (Apple M1 Max), Chrome 118.0.5993.88 (Official Build) (arm64)
    // Xbox One controller, macOS Ventura 13.5.2 (Apple M1 Max), Edge 118.0.2088.61 (Official build) (arm64)
    // Xbox One controller, macOS Ventura 13.5.2 (Apple M1 Max), Opera One (version: 103.0.4928.34) (arm64)
    // Xbox One controller, macOS Ventura 13.5.2 (Apple M1 Max), Vivaldi 6.2.3105.58 (Stable channel) (arm64)
    "Xbox Wireless Controller (STANDARD GAMEPAD Vendor: 045e Product: 02fd)",
    // Xbox One controller, macOS Ventura 13.5.2 (Apple M1 Max), Firefox 118.0.2 (64-bit)
    "45e-2fd-Xbox Wireless Controller",
    // Xbox One controller, macOS Ventura 13.5.2 (Apple M1 Max), Safari 16.6 (18615.3.12.11.2)
    "Xbox Wireless Controller Extended Gamepad",
    // Xbox One controller, Windows 10 Home 22H2 (Intel Core i7-3517U), Brave 1.59.120 Chromium: 118.0.5993.88 (Official Build) (64-bit)
    // Xbox One controller, Windows 10 Home 22H2 (Intel Core i7-3517U), Chrome 118.0.5993.89 (Official Build) (64-bit)
    // Xbox One controller, Windows 10 Home 22H2 (Intel Core i7-3517U), Edge 118.0.2088.57 (Official build) (arm64)
    // Xbox One controller, Windows 10 Home 22H2 (Intel Core i7-3517U), Opera One (version: 103.0.4928.34)
    "HID-compliant game controller (STANDARD GAMEPAD Vendor: 045e Product: 02fd)",
    // Xbox One controller, Windows 10 Home 22H2 (Intel Core i7-3517U), Vivaldi 6.2.3105.58 (Stable channel) (64-bit)
    "Xbox 360 Controller (XInput STANDARD GAMEPAD)",
    // Xbox One controller, Windows 10 Home 22H2 (Intel Core i7-3517U), Firefox 118.0.2 (64-bit)
    "xinput",
  ].forEach((id) => {
    test(`Xbox (id = "${id}")`, () => {
      expect(GamepadTypeDetector.detect(gamepad(id))).toEqual("xbox");
    });
  });

  [
    // DualSense controller, macOS Ventura 13.5.2 (Apple M1 Max), Arc 1.13.1 (42579), Chromium Engine Version 118.0.5993.88
    // DualSense controller, macOS Ventura 13.5.2 (Apple M1 Max), Brave 1.59.122 Chromium: 118.0.5993.96 (Official Build) (arm64)
    // DualSense controller, macOS Ventura 13.5.2 (Apple M1 Max), Chrome 118.0.5993.88 (Official Build) (arm64)
    // DualSense controller, macOS Ventura 13.5.2 (Apple M1 Max), Edge 118.0.2088.61 (Official build) (arm64)
    // DualSense controller, macOS Ventura 13.5.2 (Apple M1 Max), Opera One (version: 103.0.4928.34) (arm64)
    // DualSense controller, macOS Ventura 13.5.2 (Apple M1 Max), Vivaldi 6.2.3105.58 (Stable channel) (arm64)
    "DualSense Wireless Controller (STANDARD GAMEPAD Vendor: 054c Product: 0ce6)",
    // DualSense controller, macOS Ventura 13.5.2 (Apple M1 Max), Firefox 118.0.2 (64-bit)
    "54c-ce6-DualSense Wireless Controller",
    // DualSense controller, macOS Ventura 13.5.2 (Apple M1 Max), Safari 16.6 (18615.3.12.11.2)
    "DualSense Wireless Controller Extended Gamepad",
    // DualSense controller, Windows 10 Home 22H2 (Intel Core i7-3517U), Brave 1.59.120 Chromium: 118.0.5993.88 (Official Build) (64-bit)
    // DualSense controller, Windows 10 Home 22H2 (Intel Core i7-3517U), Chrome 118.0.5993.89 (Official Build) (64-bit)
    // DualSense controller, Windows 10 Home 22H2 (Intel Core i7-3517U), Edge 118.0.2088.57 (Official build) (64-bit)
    // DualSense controller, Windows 10 Home 22H2 (Intel Core i7-3517U), Opera One (version: 103.0.4928.34)
    // DualSense controller, Windows 10 Home 22H2 (Intel Core i7-3517U), Vivaldi 6.2.3105.58 (Stable channel) (64-bit)
    "Wireless Controller (STANDARD GAMEPAD Vendor: 054c Product: 0ce6)",
    // DualSense controller, Windows 10 Home 22H2 (Intel Core i7-3517U), Firefox 118.0.2 (64-bit)
    "054c-0ce6-Wireless Controller",
  ].forEach((id) => {
    test(`DualSense (id = "${id}")`, () => {
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
