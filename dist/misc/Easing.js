export class BpxEasing {
    static linear = (t) => t;
    static inQuadratic = (t) => t ** 2;
    static outQuadratic = (t) => 1 - (t - 1) ** 2;
    static inQuartic = (t) => t ** 4;
    static outQuartic = (t) => 1 - (t - 1) ** 4;
}
