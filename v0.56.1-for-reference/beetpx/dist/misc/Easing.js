import { trigCos } from "../utils/trigCos";
export class BpxEasing {
    constructor() { }
    static linear = (t) => t;
    static inQuadratic = (t) => t * t;
    static outQuadratic = (t) => 1 - (t - 1) * (t - 1);
    static inOutQuadratic = (t) => t < 0.5 ? 2 * t * t : 1 - 2 * (t - 1) * (t - 1);
    static outInQuadratic = (t) => t < 0.5 ? 0.5 - 2 * (t - 0.5) * (t - 0.5) : 0.5 + 2 * (t - 0.5) * (t - 0.5);
    static inQuartic = (t) => t * t * t * t;
    static outQuartic = (t) => 1 - (t - 1) * (t - 1) * (t - 1) * (t - 1);
    static inOutQuartic = (t) => t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (t - 1) * (t - 1) * (t - 1) * (t - 1);
    static outInQuartic = (t) => t < 0.5
        ? 0.5 - 8 * (t - 0.5) * (t - 0.5) * (t - 0.5) * (t - 0.5)
        : 0.5 + 8 * (t - 0.5) * (t - 0.5) * (t - 0.5) * (t - 0.5);
    static inOvershoot = (t) => 2.7 * t * t * t - 1.7 * t * t;
    static outOvershoot = (t) => 1 + 2.7 * (t - 1) * (t - 1) * (t - 1) + 1.7 * (t - 1) * (t - 1);
    static inOutOvershoot = (t) => t < 0.5
        ? (2.7 * 8 * t * t * t - 1.7 * 4 * t * t) / 2
        : 1 +
            (2.7 * 8 * (t - 1) * (t - 1) * (t - 1) + 1.7 * 4 * (t - 1) * (t - 1)) /
                2;
    static outInOvershoot = (t) => t < 0.5
        ? (2.7 * 8 * (t - 0.5) * (t - 0.5) * (t - 0.5) +
            1.7 * 4 * (t - 0.5) * (t - 0.5)) /
            2 +
            0.5
        : (2.7 * 8 * (t - 0.5) * (t - 0.5) * (t - 0.5) -
            1.7 * 4 * (t - 0.5) * (t - 0.5)) /
            2 +
            0.5;
    static inElastic = (t) => t === 0 ? 0 : 2 ** (10 * t - 10) * trigCos(2 * t - 2);
    static outElastic = (t) => t === 1 ? 1 : 1 - 2 ** (-10 * t) * trigCos(2 * t);
    static inOutElastic = (t) => t < 0.5
        ? (2 ** (10 * 2 * t - 10) * trigCos(2 * 2 * t - 2)) / 2
        : 1 - (2 ** (-10 * 2 * (t - 0.5)) * trigCos(2 * 2 * (t - 0.5))) / 2;
    static outInElastic = (t) => t < 0.5
        ? 0.5 - (2 ** (-10 * 2 * t) * trigCos(2 * 2 * t)) / 2
        : (2 ** (10 * 2 * (t - 0.5) - 10) * trigCos(2 * 2 * (t - 0.5) - 2)) / 2 +
            0.5;
    static inBounce = (t) => {
        t = 1 - t;
        const n1 = 7.5625;
        const d1 = 2.75;
        if (t < 1 / d1) {
            return 1 - n1 * t * t;
        }
        else if (t < 2 / d1) {
            t = t - 1.5 / d1;
            return 1 - n1 * t * t - 0.75;
        }
        else if (t < 2.5 / d1) {
            t = t - 2.25 / d1;
            return 1 - n1 * t * t - 0.9375;
        }
        else {
            t = t - 2.625 / d1;
            return 1 - n1 * t * t - 0.984375;
        }
    };
    static outBounce = (t) => {
        const n1 = 7.5625;
        const d1 = 2.75;
        if (t < 1 / d1) {
            return n1 * t * t;
        }
        else if (t < 2 / d1) {
            t = t - 1.5 / d1;
            return n1 * t * t + 0.75;
        }
        else if (t < 2.5 / d1) {
            t = t - 2.25 / d1;
            return n1 * t * t + 0.9375;
        }
        else {
            t = t - 2.625 / d1;
            return n1 * t * t + 0.984375;
        }
    };
}
//# sourceMappingURL=Easing.js.map