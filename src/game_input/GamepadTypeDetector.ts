import { GamepadType } from "./GamepadGameInput";

export class GamepadTypeDetector {
  static detect(gamepad: Gamepad): GamepadType {
    const id = gamepad.id.toLowerCase();
    if (id.includes("dualsense")) return "dualsense";
    if (id.includes("054c")) return "dualsense";
    if (id.includes("xbox")) return "xbox";
    if (id.includes("045e")) return "xbox";
    if (id.includes("xinput")) return "xbox";
    return "other";
  }
}
