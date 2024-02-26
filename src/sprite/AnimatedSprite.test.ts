import { beforeEach, describe, expect, jest, test } from "@jest/globals";
import { BeetPx } from "../BeetPx";
import { BpxUtils } from "../Utils";
import { v_ } from "../misc/Vector2d";
import { aspr_ } from "./AnimatedSprite";

describe("AnimatedSprite", () => {
  beforeEach(() => {
    jest
      .spyOn(BeetPx, "frameNumber", "get")
      .mockImplementation(() => stubbedFrameNumber);
  });

  test("aspr_", () => {
    nextFrameNumberWillBe(501);
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
    nextFrameNumberWillBe(501);
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
    nextFrameNumberWillBe(501);
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

    BpxUtils.range(xys.length).forEach(() => {
      incrementFrameNumber();
    });
    expect(sprite.current.xy).toEqual(v_(1, 10));

    nextFrameNumberWillBe(503);
    expect(sprite.current.xy).toEqual(v_(3, 30));

    nextFrameNumberWillBe(502);
    const sameSpriteCreatedAtDifferentMoment = aspr_("any.image.url")(90, 91, [
      [1, 10],
      [2, 20],
      [3, 30],
    ]);
    expect(sameSpriteCreatedAtDifferentMoment.current.xy).toEqual(v_(1, 10));
    expect(sprite.current.xy).toEqual(v_(2, 20));
  });

  test("pause/resume", () => {
    nextFrameNumberWillBe(501);
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
    BpxUtils.range(xys.length).forEach(() => {
      incrementFrameNumber();
    });
    expect(sprite.current.xy).toEqual(v_(3, 30));

    sprite.pause();

    expect(sprite.current.xy).toEqual(v_(3, 30));
    incrementFrameNumber();
    expect(sprite.current.xy).toEqual(v_(3, 30));
  });

  test("pause more than once", () => {
    nextFrameNumberWillBe(501);
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
    nextFrameNumberWillBe(501);
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
    nextFrameNumberWillBe(501);
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
    nextFrameNumberWillBe(501);
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
    nextFrameNumberWillBe(501);
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
