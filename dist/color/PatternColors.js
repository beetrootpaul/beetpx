export class BpxPatternColors {
    static of(primary, secondary) {
        return new BpxPatternColors(primary, secondary);
    }
    constructor(primary, secondary) {
        this.primary = primary;
        this.secondary = secondary;
        this.type = "pattern";
    }
}
