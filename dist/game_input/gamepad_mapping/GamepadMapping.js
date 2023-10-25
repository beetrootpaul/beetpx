import { GamepadMappingDefault } from "./GamepadMappingDefault";
import { GamepadMappingFirefoxDualSense } from "./GamepadMappingFirefoxDualSense";
import { GamepadMappingFirefoxXbox } from "./GamepadMappingFirefoxXbox";
export function gamepadMappingFor(gamepadType, browserType) {
    if (browserType === "firefox") {
        if (gamepadType === "xbox") {
            return new GamepadMappingFirefoxXbox();
        }
        else {
            // let's use DualSense as a default one for all other gamepad types
            return new GamepadMappingFirefoxDualSense();
        }
    }
    else {
        return new GamepadMappingDefault();
    }
}
