import { clamp } from "./clamp";

export function lerp(
  a: number,
  b: number,
  t: number,
  opts?: { clamp?: boolean },
): number {
  const result = a + (b - a) * t;
  return opts?.clamp ? clamp(a, result, b) : result;
}
