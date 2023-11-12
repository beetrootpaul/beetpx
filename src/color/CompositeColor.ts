import { BpxRgbColor } from "./RgbColor";

export class BpxCompositeColor {
  readonly type = "composite";

  readonly primary: BpxRgbColor | null;
  readonly secondary: BpxRgbColor | null;

  constructor(primary: BpxRgbColor | null, secondary: BpxRgbColor | null) {
    this.primary = primary;
    this.secondary = secondary;
  }
}
