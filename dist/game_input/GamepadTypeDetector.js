export class GamepadTypeDetector {
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
