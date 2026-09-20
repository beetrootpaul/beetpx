export function rand(minInclusive: number, maxExclusive: number): number {
  return minInclusive + Math.random() * (maxExclusive - minInclusive);
}
