/**
 * @category Drawing
 */
export class BpxPatternColors {
    primary;
    secondary;
    static of(primary, secondary) {
        return new BpxPatternColors(primary, secondary);
    }
    type = "pattern";
    constructor(primary, secondary) {
        this.primary = primary;
        this.secondary = secondary;
    }
}
