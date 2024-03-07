export function isDefined<Value>(
  value: Value | null | undefined,
): value is Value {
  return value != null;
}
