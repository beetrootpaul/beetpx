/**
 * @return turn angle. A full circle turn = 1. In other words: 0 deg = 0 turn, 90 deg = 0.25 turn, 180 deg = 0.5 turn, 270 deg = 0.75 turn.
 */
export function trigAtan2(x: number, y: number): number {
  return (Math.atan2(y, x) / Math.PI / 2 + 1) % 1;
}
