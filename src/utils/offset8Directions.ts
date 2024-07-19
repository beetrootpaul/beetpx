import { BpxVector2d } from "../misc/Vector2d";

// generates a list of XY to add to a given coordinate in order to get all offsets by 1 pixel in 8 directions
export function offset8Directions(): BpxVector2d[] {
  return [
    BpxVector2d.of(-1, -1),
    BpxVector2d.of(0, -1),
    BpxVector2d.of(1, -1),
    BpxVector2d.of(1, 0),
    BpxVector2d.of(1, 1),
    BpxVector2d.of(0, 1),
    BpxVector2d.of(-1, 1),
    BpxVector2d.of(-1, 0),
  ];
}
