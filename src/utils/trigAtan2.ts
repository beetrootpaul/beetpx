export function trigAtan2(x: number, y: number): number {
  return (Math.atan2(y, x) / Math.PI / 2 + 1) % 1;
}
