import { BpxVector2d } from "../misc/Vector2d";
export function adjacent8() {
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
//# sourceMappingURL=adjacent8.js.map