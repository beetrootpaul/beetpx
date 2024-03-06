import { beforeEach, describe, expect, test, vi } from "vitest";
import { BeetPx } from "../BeetPx";
import { u_ } from "../Utils";
import { v_ } from "../shorthands";
import { aspr_ } from "./AnimatedSprite";

describe("AnimatedSprite", () => {
  beforeEach(() => {
    vi.spyOn(BeetPx, "frameNumber", "get").mockImplementation(
      () => stubbedFrameNumber,
    );
    nextFrameNumberWillBe(501);
  });

  test("construction", () => {
    const sprite = aspr_("any.image.url")(90, 91, [
      [1, 10],
      [2, 20],
    ]);

    expect(sprite.imageUrl).toEqual("any.image.url");
    expect(sprite.size).toEqual(v_(90, 91));

    expect(sprite.current.size).toEqual(v_(90, 91));
    expect(sprite.current.xy).toEqual(v_(1, 10));
    incrementFrameNumber();
    expect(sprite.current.size).toEqual(v_(90, 91));
    expect(sprite.current.xy).toEqual(v_(2, 20));
  });

  test("normalization", () => {
    const sprite = aspr_("any.image.url")(-90, -91, [
      [-1, -10],
      [-2, -20],
    ]);

    expect(sprite.size).toEqual(v_(90, 91));

    expect(sprite.current.size).toEqual(v_(90, 91));
    expect(sprite.current.xy).toEqual(v_(-91, -101));
    incrementFrameNumber();
    expect(sprite.current.size).toEqual(v_(90, 91));
    expect(sprite.current.xy).toEqual(v_(-92, -111));
  });

  test("rounding", () => {
    const sprite = aspr_("any.image.url")(1.4, -20.6, [[300.2, -4000.8]]);

    expect(sprite.current.xy).toEqual(v_(300, -4021));
    expect(sprite.current.size).toEqual(v_(2, 20));
  });

  test("an uninterrupted animation", () => {
    const xys: [number, number][] = [
      [1, 10],
      [2, 20],
      [3, 30],
    ];
    const sprite = aspr_("any.image.url")(90, 91, xys);
    expect(sprite.current.xy).toEqual(v_(1, 10));
    incrementFrameNumber();
    expect(sprite.current.xy).toEqual(v_(2, 20));
    incrementFrameNumber();
    expect(sprite.current.xy).toEqual(v_(3, 30));
    incrementFrameNumber();
    expect(sprite.current.xy).toEqual(v_(1, 10));

    u_.range(xys.length).forEach(() => {
      incrementFrameNumber();
    });
    expect(sprite.current.xy).toEqual(v_(1, 10));
    incrementFrameNumber();
    expect(sprite.current.xy).toEqual(v_(2, 20));
  });

  test("when time moves backward", () => {
    nextFrameNumberWillBe(501);
    const xys: [number, number][] = [
      [1, 10],
      [2, 20],
      [3, 30],
    ];
    const sprite = aspr_("any.image.url")(90, 91, xys);
    expect(sprite.current.xy).toEqual(v_(1, 10));
    incrementFrameNumber();
    incrementFrameNumber();
    incrementFrameNumber();
    expect(sprite.current.xy).toEqual(v_(1, 10));

    nextFrameNumberWillBe(503);
    expect(sprite.current.xy).toEqual(v_(3, 30));

    nextFrameNumberWillBe(502);
    expect(sprite.current.xy).toEqual(v_(2, 20));
  });

  test("two animations started at different moments", () => {
    const xys: [number, number][] = [
      [1, 10],
      [2, 20],
      [3, 30],
    ];
    const sprite1 = aspr_("any.image.url")(90, 91, xys);
    expect(sprite1.current.xy).toEqual(v_(1, 10));

    incrementFrameNumber();
    expect(sprite1.current.xy).toEqual(v_(2, 20));

    const sprite2 = aspr_("any.image.url")(90, 91, xys);
    expect(sprite2.current.xy).toEqual(v_(1, 10));

    incrementFrameNumber();
    expect(sprite1.current.xy).toEqual(v_(3, 30));
    expect(sprite2.current.xy).toEqual(v_(2, 20));
  });

  test("pause/resume", () => {
    const xys: [number, number][] = [
      [1, 10],
      [2, 20],
      [3, 30],
      [4, 40],
      [5, 50],
    ];
    const sprite = aspr_("any.image.url")(90, 91, xys);
    expect(sprite.current.xy).toEqual(v_(1, 10));
    incrementFrameNumber();
    expect(sprite.current.xy).toEqual(v_(2, 20));

    sprite.pause();

    expect(sprite.current.xy).toEqual(v_(2, 20));

    incrementFrameNumber();
    expect(sprite.current.xy).toEqual(v_(2, 20));
    incrementFrameNumber();
    expect(sprite.current.xy).toEqual(v_(2, 20));

    sprite.resume();

    expect(sprite.current.xy).toEqual(v_(2, 20));

    incrementFrameNumber();
    expect(sprite.current.xy).toEqual(v_(3, 30));
    incrementFrameNumber();
    expect(sprite.current.xy).toEqual(v_(4, 40));

    sprite.pause();

    expect(sprite.current.xy).toEqual(v_(4, 40));

    incrementFrameNumber();
    expect(sprite.current.xy).toEqual(v_(4, 40));
    incrementFrameNumber();
    expect(sprite.current.xy).toEqual(v_(4, 40));

    sprite.resume();

    expect(sprite.current.xy).toEqual(v_(4, 40));

    incrementFrameNumber();
    expect(sprite.current.xy).toEqual(v_(5, 50));
    incrementFrameNumber();
    expect(sprite.current.xy).toEqual(v_(1, 10));
    incrementFrameNumber();
    expect(sprite.current.xy).toEqual(v_(2, 20));
    incrementFrameNumber();
    expect(sprite.current.xy).toEqual(v_(3, 30));
    u_.range(xys.length).forEach(() => {
      incrementFrameNumber();
    });
    expect(sprite.current.xy).toEqual(v_(3, 30));

    sprite.pause();

    expect(sprite.current.xy).toEqual(v_(3, 30));
    incrementFrameNumber();
    expect(sprite.current.xy).toEqual(v_(3, 30));
  });

  test("pause more than once", () => {
    const xys: [number, number][] = [
      [1, 10],
      [2, 20],
      [3, 30],
    ];
    const sprite = aspr_("any.image.url")(90, 91, xys);
    expect(sprite.current.xy).toEqual(v_(1, 10));
    incrementFrameNumber();
    expect(sprite.current.xy).toEqual(v_(2, 20));

    sprite.pause();
    sprite.pause();
    sprite.pause();
    sprite.pause();

    expect(sprite.current.xy).toEqual(v_(2, 20));
    incrementFrameNumber();
    expect(sprite.current.xy).toEqual(v_(2, 20));

    sprite.pause();
    sprite.pause();
    sprite.pause();
    sprite.pause();

    expect(sprite.current.xy).toEqual(v_(2, 20));
    incrementFrameNumber();
    expect(sprite.current.xy).toEqual(v_(2, 20));

    sprite.resume();

    expect(sprite.current.xy).toEqual(v_(2, 20));
    incrementFrameNumber();
    expect(sprite.current.xy).toEqual(v_(3, 30));
  });

  test("resume more than once", () => {
    const xys: [number, number][] = [
      [1, 10],
      [2, 20],
      [3, 30],
    ];
    const sprite = aspr_("any.image.url")(90, 91, xys);
    expect(sprite.current.xy).toEqual(v_(1, 10));
    incrementFrameNumber();
    expect(sprite.current.xy).toEqual(v_(2, 20));

    sprite.pause();

    expect(sprite.current.xy).toEqual(v_(2, 20));
    incrementFrameNumber();
    expect(sprite.current.xy).toEqual(v_(2, 20));

    sprite.resume();
    sprite.resume();
    sprite.resume();
    sprite.resume();

    expect(sprite.current.xy).toEqual(v_(2, 20));
    incrementFrameNumber();
    expect(sprite.current.xy).toEqual(v_(3, 30));

    sprite.resume();
    sprite.resume();
    sprite.resume();
    sprite.resume();

    expect(sprite.current.xy).toEqual(v_(3, 30));
    incrementFrameNumber();
    expect(sprite.current.xy).toEqual(v_(1, 10));
  });

  test("resume without pausing first", () => {
    const xys: [number, number][] = [
      [1, 10],
      [2, 20],
      [3, 30],
    ];
    const sprite = aspr_("any.image.url")(90, 91, xys);
    expect(sprite.current.xy).toEqual(v_(1, 10));
    incrementFrameNumber();
    expect(sprite.current.xy).toEqual(v_(2, 20));

    sprite.resume();

    expect(sprite.current.xy).toEqual(v_(2, 20));
    incrementFrameNumber();
    expect(sprite.current.xy).toEqual(v_(3, 30));
  });

  test("restart", () => {
    const xys: [number, number][] = [
      [1, 10],
      [2, 20],
      [3, 30],
    ];
    const sprite = aspr_("any.image.url")(90, 91, xys);
    expect(sprite.current.xy).toEqual(v_(1, 10));
    incrementFrameNumber();
    expect(sprite.current.xy).toEqual(v_(2, 20));

    sprite.restart();

    expect(sprite.current.xy).toEqual(v_(1, 10));
    incrementFrameNumber();
    expect(sprite.current.xy).toEqual(v_(2, 20));
    incrementFrameNumber();
    expect(sprite.current.xy).toEqual(v_(3, 30));
    incrementFrameNumber();
    expect(sprite.current.xy).toEqual(v_(1, 10));

    sprite.restart();

    expect(sprite.current.xy).toEqual(v_(1, 10));
    incrementFrameNumber();
    expect(sprite.current.xy).toEqual(v_(2, 20));
  });

  test("restart of a paused animation makes it no longer paused", () => {
    const xys: [number, number][] = [
      [1, 10],
      [2, 20],
      [3, 30],
      [4, 40],
      [5, 50],
    ];
    const sprite = aspr_("any.image.url")(90, 91, xys);
    expect(sprite.current.xy).toEqual(v_(1, 10));
    incrementFrameNumber();
    incrementFrameNumber();
    incrementFrameNumber();
    expect(sprite.current.xy).toEqual(v_(4, 40));

    sprite.pause();

    incrementFrameNumber();
    incrementFrameNumber();
    expect(sprite.current.xy).toEqual(v_(4, 40));

    sprite.restart();

    expect(sprite.current.xy).toEqual(v_(1, 10));
    incrementFrameNumber();
    expect(sprite.current.xy).toEqual(v_(2, 20));

    sprite.pause();

    incrementFrameNumber();
    incrementFrameNumber();
    expect(sprite.current.xy).toEqual(v_(2, 20));

    sprite.restart();

    expect(sprite.current.xy).toEqual(v_(1, 10));
    incrementFrameNumber();
    expect(sprite.current.xy).toEqual(v_(2, 20));

    sprite.pause();

    incrementFrameNumber();
    incrementFrameNumber();
    expect(sprite.current.xy).toEqual(v_(2, 20));

    sprite.resume();

    incrementFrameNumber();
    expect(sprite.current.xy).toEqual(v_(3, 30));

    incrementFrameNumber();
    expect(sprite.current.xy).toEqual(v_(4, 40));

    sprite.pause();

    incrementFrameNumber();
    incrementFrameNumber();
    expect(sprite.current.xy).toEqual(v_(4, 40));

    sprite.restart();

    expect(sprite.current.xy).toEqual(v_(1, 10));
    incrementFrameNumber();
    expect(sprite.current.xy).toEqual(v_(2, 20));
  });
});

let stubbedFrameNumber = 1;

function incrementFrameNumber(): void {
  stubbedFrameNumber += 1;
}

function nextFrameNumberWillBe(frameNumber: number): void {
  stubbedFrameNumber = frameNumber;
}
