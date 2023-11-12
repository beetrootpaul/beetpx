import { BpxColor, BpxColorId } from "./Color";
import { BpxSolidColor } from "./SolidColor";

export class BpxCompositeColor implements BpxColor {
  // noinspection JSUnusedLocalSymbols
  readonly #nominalTypeHelper__composite = true;

  readonly id: BpxColorId;

  readonly primary: BpxSolidColor | null;
  readonly secondary: BpxSolidColor | null;

  constructor(primary: BpxSolidColor | null, secondary: BpxSolidColor | null) {
    this.primary = primary;
    this.secondary = secondary;
    this.id = `composite:${this.primary?.id ?? "transparent"}:${
      this.secondary?.id ?? "transparent"
    }`;
  }
}
