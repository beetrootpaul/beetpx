/**
 * @category Drawing
 */
export class BpxPatternColors {
    primary;
    secondary;
    /**
     * @group Static factories
     */
    static of(primary, secondary) {
        return new BpxPatternColors(primary, secondary);
    }
    type = "pattern";
    constructor(primary, secondary) {
        this.primary = primary;
        this.secondary = secondary;
    }
}
