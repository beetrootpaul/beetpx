import { BpxColor, BpxColorId } from "./Color";

export class BpxTransparentColor implements BpxColor {
  // used to avoid a case where every color can be interpreted as BpxTransparentColor
  //
  // noinspection JSUnusedLocalSymbols
  readonly #nominalTypeHelper__transparent = true;

  readonly id: BpxColorId = "transparent";
}

export const transparent_ = new BpxTransparentColor();
