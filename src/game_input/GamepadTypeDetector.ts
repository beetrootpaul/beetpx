import { GamepadType } from "./GamepadGameInput";

export class GamepadTypeDetector {
  // TODO: unit tests
  // "45e-2fd-Xbox Wireless Controller"
  // "54c-ce6-DualSense Wireless Controller"
  static detect(gamepad: Gamepad): GamepadType {
    if (gamepad.id.toLowerCase().includes("dualsense")) {
      return "dualsense";
    }
    if (gamepad.id.toLowerCase().includes("xbox")) {
      return "xbox";
    }
    return "other";
  }
}
