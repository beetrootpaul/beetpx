import { BpxRgbColor } from "./RgbColor";

export class BpxPatternColors {
  readonly type = "pattern";

  constructor(
    readonly primary: BpxRgbColor | null,
    readonly secondary: BpxRgbColor | null,
  ) {}
}
