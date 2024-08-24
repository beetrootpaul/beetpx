import { $rgb_black } from "../shorthands";
import { BpxColorMapper } from "./ColorMapper";

//
// test: BpxColorMapper can be used without passing X and Y
//

{
  const anyMapper: BpxColorMapper = (sourceColor, x, y) => null;
  const mappedColor = anyMapper($rgb_black);
}
