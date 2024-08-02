/**
 * A collection of easing functions.
 *
 * @category Miscellaneous
 */
export class BpxEasing {
    constructor() { }
    /**
     * @group Static values
     */
    static linear = (t) => t;
    /**
     * @group Static values
     */
    static inQuadratic = (t) => t ** 2;
    /**
     * @group Static values
     */
    static outQuadratic = (t) => 1 - (t - 1) ** 2;
    /**
     * @group Static values
     */
    static inQuartic = (t) => t ** 4;
    /**
     * @group Static values
     */
    static outQuartic = (t) => 1 - (t - 1) ** 4;
}
