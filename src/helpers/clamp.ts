// Returns the middle number. Example usage: `clamp(min, value, max)`
//   in order to find a value which is:
//   - `value` if it is `>= min` and `<= max`
//   - `min` if `value` is `< min`
//   - `max` if `value` is `> max`
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
