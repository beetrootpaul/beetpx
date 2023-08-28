import { beforeEach, describe, expect, jest, test } from "@jest/globals";
import { GameLoop, GameLoopCallbacks } from "./GameLoop";

// TODO: rework existing tests
// TODO: write more tests to cover a complex logic of the game loop, REWORK existing ones to better describe what is happening
describe("GameLoop", () => {
  const updateFn = jest.fn<GameLoopCallbacks["updateFn"]>();
  const renderFn = jest.fn<GameLoopCallbacks["renderFn"]>();
  const requestAnimationFrameFn =
    jest.fn<AnimationFrameProvider["requestAnimationFrame"]>();

  beforeEach(() => {
    jest.resetAllMocks();
  });

  test("a simple case of no updates yet", () => {
    // given
    const updateFn = jest.fn<GameLoopCallbacks["updateFn"]>();
    const renderFn = jest.fn<GameLoopCallbacks["renderFn"]>();
    const requestAnimationFrameFn =
      jest.fn<AnimationFrameProvider["requestAnimationFrame"]>();
    const gameLoop = new GameLoop({
      desiredUpdateFps: 10,
      requestAnimationFrameFn,
    });

    // when
    requestAnimationFrameFn.mockImplementationOnce(rafWithTime(0));
    gameLoop.start({ updateFn, renderFn });

    // then
    expect(renderFn).toBeCalledTimes(1);
    expect(updateFn).toBeCalledTimes(0);
  });

  test("still no updates", () => {
    // given
    const gameLoop = new GameLoop({
      desiredUpdateFps: 10,
      requestAnimationFrameFn,
    });

    // when
    requestAnimationFrameFn.mockImplementationOnce(rafWithTime(0));
    requestAnimationFrameFn.mockImplementationOnce(rafWithTime(98));
    gameLoop.start({ updateFn, renderFn });

    // then
    expect(renderFn).toBeCalledTimes(2);
    expect(updateFn).toBeCalledTimes(0);
  });

  test("first update", () => {
    // given
    const gameLoop = new GameLoop({
      desiredUpdateFps: 10,
      requestAnimationFrameFn,
    });

    // when
    requestAnimationFrameFn.mockImplementationOnce(rafWithTime(0));
    requestAnimationFrameFn.mockImplementationOnce(rafWithTime(99));
    requestAnimationFrameFn.mockImplementationOnce(rafWithTime(100));
    gameLoop.start({ updateFn, renderFn });

    // then
    expect(renderFn).toBeCalledTimes(3);
    expect(updateFn).toBeCalledTimes(1);
  });

  test("many updates", () => {
    // given
    const gameLoop = new GameLoop({
      desiredUpdateFps: 10,
      requestAnimationFrameFn,
    });

    // when
    requestAnimationFrameFn.mockImplementationOnce(rafWithTime(0));
    requestAnimationFrameFn.mockImplementationOnce(rafWithTime(400));
    gameLoop.start({ updateFn, renderFn });

    // then
    expect(renderFn).toBeCalledTimes(2);
    expect(updateFn).toBeCalledTimes(4);
  });

  test("there is a limit of 5 updates", () => {
    // given
    const gameLoop = new GameLoop({
      desiredUpdateFps: 10,
      requestAnimationFrameFn,
    });

    // when
    requestAnimationFrameFn.mockImplementationOnce(rafWithTime(0));
    requestAnimationFrameFn.mockImplementationOnce(rafWithTime(99999));
    gameLoop.start({ updateFn, renderFn });

    // then
    expect(renderFn).toBeCalledTimes(2);
    expect(updateFn).toBeCalledTimes(5);
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
