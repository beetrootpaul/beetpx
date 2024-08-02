/**
 * A class used to detect the {@link BpxGamepadType} of a given Gamepad.
 * It's used by BeetPx internals to decide which gamepad mapping to use,
 * but you might also want to use it for in your game if needed (e.g.
 * to decide which sprite of the gamepad button to show on the controls
 * screen).
 *
 * @example
 * ```ts
 * window.addEventListener("gamepadconnected", (gamepadEvent) => {
 *   $.logDebug(`Connected: ${BpxGamepadTypeDetector.detect(gamepadEvent.gamepad))}`);
 * });
 * ```
 * @category Game input
 */
export class BpxGamepadTypeDetector {
    constructor() { }
    /**
     * @group Static methods
     */
    static detect(gamepad) {
        const id = gamepad.id.toLowerCase();
        if (id.includes("dualsense"))
            return "dualsense";
        if (id.includes("8bitdo"))
            return "8bitdo";
        if (id.includes("2dc8"))
            return "8bitdo";
        if (id.includes("054c"))
            return "dualsense";
        if (id.includes("xbox"))
            return "xbox";
        if (id.includes("045e"))
            return "xbox";
        if (id.includes("xinput"))
            return "other";
        return "other";
    }
}
