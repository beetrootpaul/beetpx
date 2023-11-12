import { BpxColor, BpxColorId } from "./Color";
import { BpxSolidColor } from "./SolidColor";
import { BpxTransparentColor } from "./TransparentColor";

export class BpxCompositeColor implements BpxColor {
  // noinspection JSUnusedLocalSymbols
  readonly #nominalTypeHelper__composite = true;

  readonly id: BpxColorId;

  readonly primary: BpxSolidColor | BpxTransparentColor;
  readonly secondary: BpxSolidColor | BpxTransparentColor;

  constructor(
    primary: BpxSolidColor | BpxTransparentColor,
    secondary: BpxSolidColor | BpxTransparentColor,
  ) {
    this.primary = primary;
    this.secondary = secondary;
    this.id = `composite:${this.primary.id}:${this.secondary.id}`;
  }
}
