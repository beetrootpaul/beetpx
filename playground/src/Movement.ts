import { BpxVector2d } from "../../src";

export interface MovementFactory {
  (startXy: BpxVector2d): Movement;
}

export interface Movement {
  get xy(): BpxVector2d;

  get speed(): BpxVector2d;

  get hasFinished(): boolean;

  pause(): void;

  resume(): void;

  update(): void;
}
