"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BpxPatternColors = void 0;
class BpxPatternColors {
    static of(primary, secondary) {
        return new BpxPatternColors(primary, secondary);
    }
    constructor(primary, secondary) {
        this.primary = primary;
        this.secondary = secondary;
        this.type = "pattern";
    }
}
exports.BpxPatternColors = BpxPatternColors;
