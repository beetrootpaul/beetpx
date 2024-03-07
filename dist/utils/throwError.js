/**
 * To be used as a value, e.g. in `definedValue: maybeUndefined() ?? throwError("…")`.
 */
export function throwError(message) {
    throw Error(message);
}
