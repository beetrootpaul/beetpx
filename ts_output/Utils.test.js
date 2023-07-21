"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const Utils_1 = require("./Utils");
(0, globals_1.describe)("Utils", () => {
    [
        // all values are same
        { params: [1, 1, 1], result: 1 },
        // all possible permutations of the order of min,mid,max
        { params: [1, 2, 3], result: 2 },
        { params: [1, 3, 2], result: 2 },
        { params: [2, 1, 3], result: 2 },
        { params: [2, 3, 1], result: 2 },
        { params: [3, 1, 2], result: 2 },
        { params: [3, 2, 1], result: 2 },
        // a negative case
        { params: [-999, -1000, -998], result: -999 },
        // a fractional case
        { params: [0.2, 0.3, 0.1], result: 0.2 },
    ].forEach(({ params, result }) => {
        (0, globals_1.test)(`#clamp(${params[0]},${params[1]},${params[2]})`, () => {
            (0, globals_1.expect)(Utils_1.Utils.clamp(params[0], params[1], params[2])).toEqual(result);
        });
    });
});
