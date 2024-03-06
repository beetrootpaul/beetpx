export type BpxEasingFn = (t: number) => number;

// TODO: move these statics outside of the class in order to make it consistent with e.g. `v_1_1_` or `rgb_red_`. Maybe similar to `export const rgb_p8_ = BpxPalettePico8`?
export class BpxEasing {
  static linear: BpxEasingFn = (t: number) => t;

  static inQuadratic: BpxEasingFn = (t: number) => t ** 2;

  static outQuadratic: BpxEasingFn = (t: number) => 1 - (t - 1) ** 2;

  static inQuartic: BpxEasingFn = (t: number) => t ** 4;

  static outQuartic: BpxEasingFn = (t: number) => 1 - (t - 1) ** 4;
}
