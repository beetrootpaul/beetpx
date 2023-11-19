import { BpxRgbColor } from "./RgbColor";

export class BpxPatternColors {
  static of(
    primary: BpxRgbColor | null,
    secondary: BpxRgbColor | null,
  ): BpxPatternColors {
    return new BpxPatternColors(primary, secondary);
  }

  readonly type = "pattern";

  constructor(
    readonly primary: BpxRgbColor | null,
    readonly secondary: BpxRgbColor | null,
  ) {}
}
