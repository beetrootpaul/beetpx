import { BpxRgbColor } from "./RgbColor";

export class BpxCompositeColor {
  // noinspection JSUnusedLocalSymbols
  readonly #nominalTypeHelper__composite = true;

  readonly primary: BpxRgbColor | null;
  readonly secondary: BpxRgbColor | null;

  constructor(primary: BpxRgbColor | null, secondary: BpxRgbColor | null) {
    this.primary = primary;
    this.secondary = secondary;
  }
}
