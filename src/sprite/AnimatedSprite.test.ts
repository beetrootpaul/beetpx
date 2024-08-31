import { beforeEach, describe, expect, test, vi } from "vitest";
import { BeetPx } from "../";
import { $aspr, $v } from "../shorthands";
import { range } from "../utils/range";

describe("AnimatedSprite", () => {
  beforeEach(() => {
    vi.spyOn(BeetPx, "frameNumberOutsidePause", "get").mockImplementation(
      () => stubbedFrameNumber,
    );
    nextFrameNumberWillBe(501);
  });

  test("construction", () => {
    const sprite = $aspr("any.image.url")(90, 91, [
      [1, 10],
      [2, 20],
    ]);

    expect(sprite.imageUrl).toEqual("any.image.url");
    expect(sprite.size).toEqual($v(90, 91));
    expect(sprite.t).toEqual(0);

    expect(sprite.current.size).toEqual($v(90, 91));
    expect(sprite.current.xy).toEqual($v(1, 10));
    incrementFrameNumber();
    expect(sprite.current.size).toEqual($v(90, 91));
    expect(sprite.current.xy).toEqual($v(2, 20));
  });

  test("normalization", () => {
    const sprite = $aspr("any.image.url")(-90, -91, [
      [-1, -10],
      [-2, -20],
    ]);

    expect(sprite.size).toEqual($v(90, 91));

    expect(sprite.current.size).toEqual($v(90, 91));
    expect(sprite.current.xy).toEqual($v(-91, -101));
    incrementFrameNumber();
    expect(sprite.current.size).toEqual($v(90, 91));
    expect(sprite.current.xy).toEqual($v(-92, -111));
  });

  test("rounding", () => {
    const sprite = $aspr("any.image.url")(1.4, -20.6, [[300.2, -4000.8]]);

    expect(sprite.current.xy).toEqual($v(300, -4021));
    expect(sprite.current.size).toEqual($v(2, 20));
  });

  test("an uninterrupted animation", () => {
    const xys: [number, number][] = [
      [1, 10],
      [2, 20],
      [3, 30],
    ];
    const sprite = $aspr("any.image.url")(90, 91, xys);
    expect(sprite.t).toEqual(0);
    expect(sprite.current.xy).toEqual($v(1, 10));
    incrementFrameNumber();
    expect(sprite.t).toEqual(1);
    expect(sprite.current.xy).toEqual($v(2, 20));
    incrementFrameNumber();
    expect(sprite.t).toEqual(2);
    expect(sprite.current.xy).toEqual($v(3, 30));
    incrementFrameNumber();
    expect(sprite.t).toEqual(0);
    expect(sprite.current.xy).toEqual($v(1, 10));

    range(xys.length).forEach(() => {
      incrementFrameNumber();
    });
    expect(sprite.t).toEqual(0);
    expect(sprite.current.xy).toEqual($v(1, 10));
    incrementFrameNumber();
    expect(sprite.t).toEqual(1);
    expect(sprite.current.xy).toEqual($v(2, 20));
  });

  test("frame duration", () => {
    const xys: [number, number][] = [
      [1, 10],
      [2, 20],
      [3, 30],
    ];
    const frameDuration = 3;
    const sprite = $aspr("any.image.url")(90, 91, xys, { frameDuration });
    expect(sprite.t).toEqual(0);
    expect(sprite.current.xy).toEqual($v(1, 10));
    incrementFrameNumber();
    expect(sprite.t).toEqual(0);
    expect(sprite.current.xy).toEqual($v(1, 10));
    incrementFrameNumber();
    expect(sprite.t).toEqual(0);
    expect(sprite.current.xy).toEqual($v(1, 10));
    incrementFrameNumber();
    expect(sprite.t).toEqual(1);
    expect(sprite.current.xy).toEqual($v(2, 20));
    incrementFrameNumber();
    expect(sprite.t).toEqual(1);
    expect(sprite.current.xy).toEqual($v(2, 20));
    incrementFrameNumber();
    expect(sprite.t).toEqual(1);
    expect(sprite.current.xy).toEqual($v(2, 20));
    incrementFrameNumber();
    expect(sprite.t).toEqual(2);
    expect(sprite.current.xy).toEqual($v(3, 30));
    incrementFrameNumber();
    expect(sprite.t).toEqual(2);
    expect(sprite.current.xy).toEqual($v(3, 30));
    incrementFrameNumber();
    expect(sprite.t).toEqual(2);
    expect(sprite.current.xy).toEqual($v(3, 30));
    incrementFrameNumber();
    expect(sprite.t).toEqual(0);
    expect(sprite.current.xy).toEqual($v(1, 10));

    range(xys.length * frameDuration).forEach(() => {
      incrementFrameNumber();
    });

    incrementFrameNumber();
    expect(sprite.t).toEqual(0);
    expect(sprite.current.xy).toEqual($v(1, 10));
    incrementFrameNumber();
    expect(sprite.t).toEqual(0);
    expect(sprite.current.xy).toEqual($v(1, 10));
    incrementFrameNumber();
    expect(sprite.t).toEqual(1);
    expect(sprite.current.xy).toEqual($v(2, 20));
  });

  test("when time moves backward", () => {
    nextFrameNumberWillBe(501);
    const xys: [number, number][] = [
      [1, 10],
      [2, 20],
      [3, 30],
    ];
    const sprite = $aspr("any.image.url")(90, 91, xys);
    expect(sprite.t).toEqual(0);
    expect(sprite.current.xy).toEqual($v(1, 10));
    incrementFrameNumber();
    incrementFrameNumber();
    incrementFrameNumber();
    expect(sprite.t).toEqual(0);
    expect(sprite.current.xy).toEqual($v(1, 10));

    nextFrameNumberWillBe(503);
    expect(sprite.t).toEqual(2);
    expect(sprite.current.xy).toEqual($v(3, 30));

    nextFrameNumberWillBe(502);
    expect(sprite.t).toEqual(1);
    expect(sprite.current.xy).toEqual($v(2, 20));
  });

  test("two animations started at different moments", () => {
    const xys: [number, number][] = [
      [1, 10],
      [2, 20],
      [3, 30],
    ];
    const sprite1 = $aspr("any.image.url")(90, 91, xys);
    expect(sprite1.t).toEqual(0);
    expect(sprite1.current.xy).toEqual($v(1, 10));

    incrementFrameNumber();
    expect(sprite1.t).toEqual(1);
    expect(sprite1.current.xy).toEqual($v(2, 20));

    const sprite2 = $aspr("any.image.url")(90, 91, xys);
    expect(sprite2.t).toEqual(0);
    expect(sprite2.current.xy).toEqual($v(1, 10));

    incrementFrameNumber();
    expect(sprite1.t).toEqual(2);
    expect(sprite1.current.xy).toEqual($v(3, 30));
    expect(sprite2.t).toEqual(1);
    expect(sprite2.current.xy).toEqual($v(2, 20));
  });

  test("pause/resume", () => {
    const xys: [number, number][] = [
      [1, 10],
      [2, 20],
      [3, 30],
      [4, 40],
      [5, 50],
    ];
    const sprite = $aspr("any.image.url")(90, 91, xys);
    expect(sprite.t).toEqual(0);
    expect(sprite.current.xy).toEqual($v(1, 10));
    expect(sprite.isPaused).toEqual(false);
    incrementFrameNumber();
    expect(sprite.t).toEqual(1);
    expect(sprite.current.xy).toEqual($v(2, 20));
    expect(sprite.isPaused).toEqual(false);

    sprite.pause();

    expect(sprite.t).toEqual(1);
    expect(sprite.current.xy).toEqual($v(2, 20));
    expect(sprite.isPaused).toEqual(true);

    incrementFrameNumber();
    expect(sprite.t).toEqual(1);
    expect(sprite.current.xy).toEqual($v(2, 20));
    expect(sprite.isPaused).toEqual(true);
    incrementFrameNumber();
    expect(sprite.t).toEqual(1);
    expect(sprite.current.xy).toEqual($v(2, 20));
    expect(sprite.isPaused).toEqual(true);

    sprite.resume();

    expect(sprite.t).toEqual(1);
    expect(sprite.current.xy).toEqual($v(2, 20));
    expect(sprite.isPaused).toEqual(false);

    incrementFrameNumber();
    expect(sprite.t).toEqual(2);
    expect(sprite.current.xy).toEqual($v(3, 30));
    expect(sprite.isPaused).toEqual(false);
    incrementFrameNumber();
    expect(sprite.t).toEqual(3);
    expect(sprite.current.xy).toEqual($v(4, 40));
    expect(sprite.isPaused).toEqual(false);

    sprite.pause();

    expect(sprite.t).toEqual(3);
    expect(sprite.current.xy).toEqual($v(4, 40));
    expect(sprite.isPaused).toEqual(true);

    incrementFrameNumber();
    expect(sprite.t).toEqual(3);
    expect(sprite.current.xy).toEqual($v(4, 40));
    expect(sprite.isPaused).toEqual(true);
    incrementFrameNumber();
    expect(sprite.t).toEqual(3);
    expect(sprite.current.xy).toEqual($v(4, 40));
    expect(sprite.isPaused).toEqual(true);

    sprite.resume();

    expect(sprite.t).toEqual(3);
    expect(sprite.current.xy).toEqual($v(4, 40));
    expect(sprite.isPaused).toEqual(false);

    incrementFrameNumber();
    expect(sprite.t).toEqual(4);
    expect(sprite.current.xy).toEqual($v(5, 50));
    expect(sprite.isPaused).toEqual(false);
    incrementFrameNumber();
    expect(sprite.t).toEqual(0);
    expect(sprite.current.xy).toEqual($v(1, 10));
    expect(sprite.isPaused).toEqual(false);
    incrementFrameNumber();
    expect(sprite.t).toEqual(1);
    expect(sprite.current.xy).toEqual($v(2, 20));
    expect(sprite.isPaused).toEqual(false);
    incrementFrameNumber();
    expect(sprite.t).toEqual(2);
    expect(sprite.current.xy).toEqual($v(3, 30));
    expect(sprite.isPaused).toEqual(false);
    range(xys.length).forEach(() => {
      incrementFrameNumber();
    });
    expect(sprite.t).toEqual(2);
    expect(sprite.current.xy).toEqual($v(3, 30));
    expect(sprite.isPaused).toEqual(false);

    sprite.pause();

    expect(sprite.t).toEqual(2);
    expect(sprite.current.xy).toEqual($v(3, 30));
    expect(sprite.isPaused).toEqual(true);
    incrementFrameNumber();
    expect(sprite.t).toEqual(2);
    expect(sprite.current.xy).toEqual($v(3, 30));
    expect(sprite.isPaused).toEqual(true);
  });

  test("pause more than once", () => {
    const xys: [number, number][] = [
      [1, 10],
      [2, 20],
      [3, 30],
    ];
    const sprite = $aspr("any.image.url")(90, 91, xys);
    expect(sprite.t).toEqual(0);
    expect(sprite.current.xy).toEqual($v(1, 10));
    expect(sprite.isPaused).toEqual(false);
    incrementFrameNumber();
    expect(sprite.t).toEqual(1);
    expect(sprite.current.xy).toEqual($v(2, 20));
    expect(sprite.isPaused).toEqual(false);

    sprite.pause();
    sprite.pause();
    sprite.pause();
    sprite.pause();

    expect(sprite.t).toEqual(1);
    expect(sprite.current.xy).toEqual($v(2, 20));
    expect(sprite.isPaused).toEqual(true);
    incrementFrameNumber();
    expect(sprite.t).toEqual(1);
    expect(sprite.current.xy).toEqual($v(2, 20));
    expect(sprite.isPaused).toEqual(true);

    sprite.pause();
    sprite.pause();
    sprite.pause();
    sprite.pause();

    expect(sprite.t).toEqual(1);
    expect(sprite.current.xy).toEqual($v(2, 20));
    expect(sprite.isPaused).toEqual(true);
    incrementFrameNumber();
    expect(sprite.t).toEqual(1);
    expect(sprite.current.xy).toEqual($v(2, 20));
    expect(sprite.isPaused).toEqual(true);

    sprite.resume();

    expect(sprite.t).toEqual(1);
    expect(sprite.current.xy).toEqual($v(2, 20));
    expect(sprite.isPaused).toEqual(false);
    incrementFrameNumber();
    expect(sprite.t).toEqual(2);
    expect(sprite.current.xy).toEqual($v(3, 30));
    expect(sprite.isPaused).toEqual(false);
  });

  test("resume more than once", () => {
    const xys: [number, number][] = [
      [1, 10],
      [2, 20],
      [3, 30],
    ];
    const sprite = $aspr("any.image.url")(90, 91, xys);
    expect(sprite.t).toEqual(0);
    expect(sprite.current.xy).toEqual($v(1, 10));
    expect(sprite.isPaused).toEqual(false);
    incrementFrameNumber();
    expect(sprite.t).toEqual(1);
    expect(sprite.current.xy).toEqual($v(2, 20));
    expect(sprite.isPaused).toEqual(false);

    sprite.pause();

    expect(sprite.t).toEqual(1);
    expect(sprite.current.xy).toEqual($v(2, 20));
    expect(sprite.isPaused).toEqual(true);
    incrementFrameNumber();
    expect(sprite.t).toEqual(1);
    expect(sprite.current.xy).toEqual($v(2, 20));
    expect(sprite.isPaused).toEqual(true);

    sprite.resume();
    sprite.resume();
    sprite.resume();
    sprite.resume();

    expect(sprite.t).toEqual(1);
    expect(sprite.current.xy).toEqual($v(2, 20));
    expect(sprite.isPaused).toEqual(false);
    incrementFrameNumber();
    expect(sprite.t).toEqual(2);
    expect(sprite.current.xy).toEqual($v(3, 30));
    expect(sprite.isPaused).toEqual(false);

    sprite.resume();
    sprite.resume();
    sprite.resume();
    sprite.resume();

    expect(sprite.t).toEqual(2);
    expect(sprite.current.xy).toEqual($v(3, 30));
    expect(sprite.isPaused).toEqual(false);
    incrementFrameNumber();
    expect(sprite.t).toEqual(0);
    expect(sprite.current.xy).toEqual($v(1, 10));
    expect(sprite.isPaused).toEqual(false);
  });

  test("resume without pausing first", () => {
    const xys: [number, number][] = [
      [1, 10],
      [2, 20],
      [3, 30],
    ];
    const sprite = $aspr("any.image.url")(90, 91, xys);
    expect(sprite.t).toEqual(0);
    expect(sprite.current.xy).toEqual($v(1, 10));
    expect(sprite.isPaused).toEqual(false);
    incrementFrameNumber();
    expect(sprite.t).toEqual(1);
    expect(sprite.current.xy).toEqual($v(2, 20));
    expect(sprite.isPaused).toEqual(false);

    sprite.resume();

    expect(sprite.t).toEqual(1);
    expect(sprite.current.xy).toEqual($v(2, 20));
    expect(sprite.isPaused).toEqual(false);
    incrementFrameNumber();
    expect(sprite.t).toEqual(2);
    expect(sprite.current.xy).toEqual($v(3, 30));
    expect(sprite.isPaused).toEqual(false);
  });

  test("restart", () => {
    const xys: [number, number][] = [
      [1, 10],
      [2, 20],
      [3, 30],
    ];
    const sprite = $aspr("any.image.url")(90, 91, xys);
    expect(sprite.t).toEqual(0);
    expect(sprite.current.xy).toEqual($v(1, 10));
    incrementFrameNumber();
    expect(sprite.t).toEqual(1);
    expect(sprite.current.xy).toEqual($v(2, 20));

    sprite.restart();

    expect(sprite.t).toEqual(0);
    expect(sprite.current.xy).toEqual($v(1, 10));
    incrementFrameNumber();
    expect(sprite.t).toEqual(1);
    expect(sprite.current.xy).toEqual($v(2, 20));
    incrementFrameNumber();
    expect(sprite.t).toEqual(2);
    expect(sprite.current.xy).toEqual($v(3, 30));
    incrementFrameNumber();
    expect(sprite.t).toEqual(0);
    expect(sprite.current.xy).toEqual($v(1, 10));

    sprite.restart();

    expect(sprite.t).toEqual(0);
    expect(sprite.current.xy).toEqual($v(1, 10));
    incrementFrameNumber();
    expect(sprite.t).toEqual(1);
    expect(sprite.current.xy).toEqual($v(2, 20));
  });

  test("restart of a paused animation makes it no longer paused", () => {
    const xys: [number, number][] = [
      [1, 10],
      [2, 20],
      [3, 30],
      [4, 40],
      [5, 50],
    ];
    const sprite = $aspr("any.image.url")(90, 91, xys);
    expect(sprite.t).toEqual(0);
    expect(sprite.current.xy).toEqual($v(1, 10));
    expect(sprite.isPaused).toEqual(false);
    incrementFrameNumber();
    incrementFrameNumber();
    incrementFrameNumber();
    expect(sprite.t).toEqual(3);
    expect(sprite.current.xy).toEqual($v(4, 40));
    expect(sprite.isPaused).toEqual(false);

    sprite.pause();

    incrementFrameNumber();
    incrementFrameNumber();
    expect(sprite.t).toEqual(3);
    expect(sprite.current.xy).toEqual($v(4, 40));
    expect(sprite.isPaused).toEqual(true);

    sprite.restart();

    expect(sprite.t).toEqual(0);
    expect(sprite.current.xy).toEqual($v(1, 10));
    expect(sprite.isPaused).toEqual(false);
    incrementFrameNumber();
    expect(sprite.t).toEqual(1);
    expect(sprite.current.xy).toEqual($v(2, 20));
    expect(sprite.isPaused).toEqual(false);

    sprite.pause();

    incrementFrameNumber();
    incrementFrameNumber();
    expect(sprite.t).toEqual(1);
    expect(sprite.current.xy).toEqual($v(2, 20));
    expect(sprite.isPaused).toEqual(true);

    sprite.restart();

    expect(sprite.t).toEqual(0);
    expect(sprite.current.xy).toEqual($v(1, 10));
    expect(sprite.isPaused).toEqual(false);
    incrementFrameNumber();
    expect(sprite.t).toEqual(1);
    expect(sprite.current.xy).toEqual($v(2, 20));
    expect(sprite.isPaused).toEqual(false);

    sprite.pause();

    incrementFrameNumber();
    incrementFrameNumber();
    expect(sprite.t).toEqual(1);
    expect(sprite.current.xy).toEqual($v(2, 20));
    expect(sprite.isPaused).toEqual(true);

    sprite.resume();

    incrementFrameNumber();
    expect(sprite.t).toEqual(2);
    expect(sprite.current.xy).toEqual($v(3, 30));
    expect(sprite.isPaused).toEqual(false);

    incrementFrameNumber();
    expect(sprite.t).toEqual(3);
    expect(sprite.current.xy).toEqual($v(4, 40));
    expect(sprite.isPaused).toEqual(false);

    sprite.pause();

    incrementFrameNumber();
    incrementFrameNumber();
    expect(sprite.t).toEqual(3);
    expect(sprite.current.xy).toEqual($v(4, 40));
    expect(sprite.isPaused).toEqual(true);

    sprite.restart();

    expect(sprite.t).toEqual(0);
    expect(sprite.current.xy).toEqual($v(1, 10));
    expect(sprite.isPaused).toEqual(false);
    incrementFrameNumber();
    expect(sprite.t).toEqual(1);
    expect(sprite.current.xy).toEqual($v(2, 20));
    expect(sprite.isPaused).toEqual(false);
  });
});

let stubbedFrameNumber = 1;

function incrementFrameNumber(): void {
  stubbedFrameNumber += 1;
}

function nextFrameNumberWillBe(frameNumber: number): void {
  stubbedFrameNumber = frameNumber;
}
