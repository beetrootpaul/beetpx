"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const Utils_1 = require("../Utils");
const Timer_1 = require("./Timer");
(0, globals_1.describe)("Timer", () => {
    (0, globals_1.describe)("#framesLeft", () => {
        (0, globals_1.test)("for a 0 frames long timer", () => {
            const timer = new Timer_1.Timer({ frames: 0 });
            (0, globals_1.expect)(timer.framesLeft).toBe(0);
        });
        (0, globals_1.test)("for a 1 frame long timer", () => {
            const timer = new Timer_1.Timer({ frames: 1 });
            (0, globals_1.expect)(timer.framesLeft).toBe(1);
            timer.update();
            (0, globals_1.expect)(timer.framesLeft).toBe(0);
            timer.update();
            (0, globals_1.expect)(timer.framesLeft).toBe(0);
        });
        (0, globals_1.test)("for a 2 frames long timer", () => {
            const timer = new Timer_1.Timer({ frames: 2 });
            (0, globals_1.expect)(timer.framesLeft).toBe(2);
            timer.update();
            (0, globals_1.expect)(timer.framesLeft).toBe(1);
            timer.update();
            (0, globals_1.expect)(timer.framesLeft).toBe(0);
        });
        (0, globals_1.test)("for a many frames long timer", () => {
            const timer = new Timer_1.Timer({ frames: 100 });
            (0, globals_1.expect)(timer.framesLeft).toBe(100);
            timer.update();
            (0, globals_1.expect)(timer.framesLeft).toBe(99);
            timer.update();
            (0, globals_1.expect)(timer.framesLeft).toBe(98);
            Utils_1.Utils.repeatN(96, () => {
                timer.update();
            });
            (0, globals_1.expect)(timer.framesLeft).toBe(2);
            timer.update();
            (0, globals_1.expect)(timer.framesLeft).toBe(1);
            timer.update();
            (0, globals_1.expect)(timer.framesLeft).toBe(0);
        });
        (0, globals_1.test)("for a negative amount of frames", () => {
            const timer = new Timer_1.Timer({ frames: -1 });
            (0, globals_1.expect)(timer.framesLeft).toBe(0);
        });
    });
    (0, globals_1.describe)("#progress", () => {
        (0, globals_1.test)("for a 0 frames long timer", () => {
            const timer = new Timer_1.Timer({ frames: 0 });
            (0, globals_1.expect)(timer.progress).toBe(1);
        });
        (0, globals_1.test)("for a 1 frame long timer", () => {
            const timer = new Timer_1.Timer({ frames: 1 });
            (0, globals_1.expect)(timer.progress).toBe(0);
            timer.update();
            (0, globals_1.expect)(timer.progress).toBe(1);
            timer.update();
            (0, globals_1.expect)(timer.progress).toBe(1);
        });
        (0, globals_1.test)("for a 2 frames long timer", () => {
            const timer = new Timer_1.Timer({ frames: 2 });
            (0, globals_1.expect)(timer.progress).toBe(0);
            timer.update();
            (0, globals_1.expect)(timer.progress).toBe(0.5);
            timer.update();
            (0, globals_1.expect)(timer.progress).toBe(1);
        });
        (0, globals_1.test)("for a many frames long timer", () => {
            const timer = new Timer_1.Timer({ frames: 100 });
            (0, globals_1.expect)(timer.progress).toBe(0);
            timer.update();
            (0, globals_1.expect)(timer.progress).toBeCloseTo(0.01, 2);
            timer.update();
            (0, globals_1.expect)(timer.progress).toBeCloseTo(0.02, 2);
            Utils_1.Utils.repeatN(96, () => {
                timer.update();
            });
            (0, globals_1.expect)(timer.progress).toBeCloseTo(0.98, 2);
            timer.update();
            (0, globals_1.expect)(timer.progress).toBeCloseTo(0.99, 2);
            timer.update();
            (0, globals_1.expect)(timer.progress).toBeCloseTo(1.0, 2);
        });
        (0, globals_1.test)("for a negative amount of frames", () => {
            const timer = new Timer_1.Timer({ frames: -1 });
            (0, globals_1.expect)(timer.progress).toBe(1);
        });
    });
    (0, globals_1.describe)("#hasFinished", () => {
        (0, globals_1.test)("for a 0 frames long timer", () => {
            const timer = new Timer_1.Timer({ frames: 0 });
            (0, globals_1.expect)(timer.hasFinished).toBe(true);
        });
        (0, globals_1.test)("for a 1 frame long timer", () => {
            const timer = new Timer_1.Timer({ frames: 1 });
            (0, globals_1.expect)(timer.hasFinished).toBe(false);
            timer.update();
            (0, globals_1.expect)(timer.hasFinished).toBe(true);
            timer.update();
            (0, globals_1.expect)(timer.hasFinished).toBe(true);
        });
        (0, globals_1.test)("for a 2 frames long timer", () => {
            const timer = new Timer_1.Timer({ frames: 2 });
            (0, globals_1.expect)(timer.hasFinished).toBe(false);
            timer.update();
            (0, globals_1.expect)(timer.hasFinished).toBe(false);
            timer.update();
            (0, globals_1.expect)(timer.hasFinished).toBe(true);
        });
        (0, globals_1.test)("for a many frames long timer", () => {
            const timer = new Timer_1.Timer({ frames: 100 });
            (0, globals_1.expect)(timer.hasFinished).toBe(false);
            timer.update();
            (0, globals_1.expect)(timer.hasFinished).toBe(false);
            timer.update();
            (0, globals_1.expect)(timer.hasFinished).toBe(false);
            Utils_1.Utils.repeatN(96, () => {
                timer.update();
            });
            (0, globals_1.expect)(timer.hasFinished).toBe(false);
            timer.update();
            (0, globals_1.expect)(timer.hasFinished).toBe(false);
            timer.update();
            (0, globals_1.expect)(timer.hasFinished).toBe(true);
        });
        (0, globals_1.test)("for a negative amount of frames", () => {
            const timer = new Timer_1.Timer({ frames: -1 });
            (0, globals_1.expect)(timer.hasFinished).toBe(true);
        });
    });
});
