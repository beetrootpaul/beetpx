import { clamp } from "./clamp";
export function lerp(a, b, t, opts) {
    const result = a + (b - a) * t;
    return opts?.clamp ? clamp(a, result, b) : result;
}
//# sourceMappingURL=lerp.js.map