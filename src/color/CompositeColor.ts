import { BpxColor, BpxColorId } from "./Color";
import { BpxRgbColor } from "./RgbColor";

export class BpxCompositeColor implements BpxColor {
  // noinspection JSUnusedLocalSymbols
  readonly #nominalTypeHelper__composite = true;

  readonly id: BpxColorId;

  readonly primary: BpxRgbColor | null;
  readonly secondary: BpxRgbColor | null;

  constructor(primary: BpxRgbColor | null, secondary: BpxRgbColor | null) {
    this.primary = primary;
    this.secondary = secondary;
    this.id = `composite:${this.primary?.id ?? "transparent"}:${
      this.secondary?.id ?? "transparent"
    }`;
  }
}
