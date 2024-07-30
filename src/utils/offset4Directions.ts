import { BpxVector2d } from "../misc/Vector2d";

export function offset4Directions(): BpxVector2d[] {
  return [
    BpxVector2d.of(-1, -1),
    BpxVector2d.of(1, -1),
    BpxVector2d.of(1, 1),
    BpxVector2d.of(-1, 1),
  ];
}
