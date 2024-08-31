import { rand } from "./rand";

export function randInt(minInclusive: number, maxExclusive: number): number {
  return Math.floor(rand(Math.ceil(minInclusive), Math.floor(maxExclusive)));
}
