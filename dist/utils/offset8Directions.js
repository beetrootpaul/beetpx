import { BpxVector2d } from "../misc/Vector2d";
export function offset8Directions() {
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
//# sourceMappingURL=offset8Directions.js.map