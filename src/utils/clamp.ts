export function clamp(a: number, b: number, c: number): number {
  return (
    a < b ?
      b < c ? b
      : a < c ? c
      : a
    : b > c ? b
    : a > c ? c
    : a
  );
}
