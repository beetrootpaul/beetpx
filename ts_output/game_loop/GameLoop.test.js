"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const GameLoop_1 = require("./GameLoop");
// TODO: write more tests to cover a complex logic of the game loop, REWORK existing ones to better describe what is happening
(0, globals_1.describe)("GameLoop", () => {
    const updateFn = globals_1.jest.fn();
    const renderFn = globals_1.jest.fn();
    const requestAnimationFrameFn = globals_1.jest.fn();
    (0, globals_1.beforeEach)(() => {
        globals_1.jest.resetAllMocks();
    });
    (0, globals_1.test)("a simple case of a single update", () => {
        // given
        const updateFn = globals_1.jest.fn();
        const renderFn = globals_1.jest.fn();
        const requestAnimationFrameFn = globals_1.jest.fn();
        const gameLoop = new GameLoop_1.GameLoop({ desiredFps: 10, requestAnimationFrameFn });
        // when
        requestAnimationFrameFn.mockImplementationOnce(rafWithTime(0));
        gameLoop.start({ updateFn, renderFn });
        // then
        (0, globals_1.expect)(updateFn).toBeCalledTimes(1);
        (0, globals_1.expect)(renderFn).toBeCalledTimes(1);
    });
    (0, globals_1.test)("still a single update", () => {
        // given
        const desiredFps = 10;
        const gameLoop = new GameLoop_1.GameLoop({ desiredFps, requestAnimationFrameFn });
        // when
        requestAnimationFrameFn.mockImplementationOnce(rafWithTime(0));
        requestAnimationFrameFn.mockImplementationOnce(rafWithTime(98));
        gameLoop.start({ updateFn, renderFn });
        // then
        (0, globals_1.expect)(updateFn).toBeCalledTimes(1);
        (0, globals_1.expect)(renderFn).toBeCalledTimes(2);
    });
    (0, globals_1.test)("two updates", () => {
        // given
        const desiredFps = 10;
        const gameLoop = new GameLoop_1.GameLoop({ desiredFps, requestAnimationFrameFn });
        // when
        requestAnimationFrameFn.mockImplementationOnce(rafWithTime(0));
        requestAnimationFrameFn.mockImplementationOnce(rafWithTime(99));
        requestAnimationFrameFn.mockImplementationOnce(rafWithTime(1));
        gameLoop.start({ updateFn, renderFn });
        // then
        (0, globals_1.expect)(updateFn).toBeCalledTimes(2);
        (0, globals_1.expect)(renderFn).toBeCalledTimes(3);
    });
});
let nextRafRequestId = 1;
function rafWithTime(time) {
    return (callback) => {
        callback(time);
        return nextRafRequestId++;
    };
}
