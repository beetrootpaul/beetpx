/**
 * An interface to extend if you want to define `__printDebug()` – a convenience method used by
 * the internal logger to print objects in a custom way. An example is built-in
 * {@link BpxVector2d} type which defined `__printDebug()` in order to be printed
 * by the logger in a `(x,y)` format.
 *
 * @see {@link BeetPx.logDebug}
 * @see {@link BeetPx.logInfo}
 * @see {@link BeetPx.logWarn}
 * @see {@link BeetPx.logError}
 *
 * @category Miscellaneous
 */
export interface BpxPrintDebug {
  __printDebug(): string;
}
