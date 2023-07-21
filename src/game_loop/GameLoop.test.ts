import { beforeEach, describe, expect, jest, test } from "@jest/globals";
import { GameLoop, GameLoopCallbacks } from "./GameLoop";

// TODO: write more tests to cover a complex logic of the game loop, REWORK existing ones to better describe what is happening
describe("GameLoop", () => {
  const updateFn = jest.fn<GameLoopCallbacks["updateFn"]>();
  const renderFn = jest.fn<GameLoopCallbacks["renderFn"]>();
  const requestAnimationFrameFn =
    jest.fn<AnimationFrameProvider["requestAnimationFrame"]>();

  beforeEach(() => {
    jest.resetAllMocks();
  });

  test("a simple case of a single update", () => {
    // given
    const updateFn = jest.fn<GameLoopCallbacks["updateFn"]>();
    const renderFn = jest.fn<GameLoopCallbacks["renderFn"]>();
    const requestAnimationFrameFn =
      jest.fn<AnimationFrameProvider["requestAnimationFrame"]>();
    const gameLoop = new GameLoop({ desiredFps: 10, requestAnimationFrameFn });

    // when
    requestAnimationFrameFn.mockImplementationOnce(rafWithTime(0));
    gameLoop.start({ updateFn, renderFn });

    // then
    expect(updateFn).toBeCalledTimes(1);
    expect(renderFn).toBeCalledTimes(1);
  });

  test("still a single update", () => {
    // given
    const desiredFps = 10;
    const gameLoop = new GameLoop({ desiredFps, requestAnimationFrameFn });

    // when
    requestAnimationFrameFn.mockImplementationOnce(rafWithTime(0));
    requestAnimationFrameFn.mockImplementationOnce(rafWithTime(98));
    gameLoop.start({ updateFn, renderFn });

    // then
    expect(updateFn).toBeCalledTimes(1);
    expect(renderFn).toBeCalledTimes(2);
  });

  test("two updates", () => {
    // given
    const desiredFps = 10;
    const gameLoop = new GameLoop({ desiredFps, requestAnimationFrameFn });

    // when
    requestAnimationFrameFn.mockImplementationOnce(rafWithTime(0));
    requestAnimationFrameFn.mockImplementationOnce(rafWithTime(99));
    requestAnimationFrameFn.mockImplementationOnce(rafWithTime(1));
    gameLoop.start({ updateFn, renderFn });

    // then
    expect(updateFn).toBeCalledTimes(2);
    expect(renderFn).toBeCalledTimes(3);
  });
});

let nextRafRequestId = 1;

function rafWithTime(
  time: DOMHighResTimeStamp,
): AnimationFrameProvider["requestAnimationFrame"] {
  return (callback) => {
    callback(time);
    return nextRafRequestId++;
  };
}
