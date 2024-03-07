export function randomElementOf<TElement>(
  array: TElement[],
): TElement | undefined {
  if (array.length <= 0) return undefined;
  return array[Math.floor(Math.random() * array.length)];
}
