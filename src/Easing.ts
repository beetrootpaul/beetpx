export type BpxEasingFn = (t: number) => number;

export class BpxEasing {
  static linear: BpxEasingFn = (t: number) => t;

  static inQuadratic: BpxEasingFn = (t: number) => t ** 2;

  static outQuadratic: BpxEasingFn = (t: number) => 1 - (t - 1) ** 2;

  static inQuartic: BpxEasingFn = (t: number) => t ** 4;

  static outQuartic: BpxEasingFn = (t: number) => 1 - (t - 1) ** 4;
}
