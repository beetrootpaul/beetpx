
export class BpxEasing {
}
BpxEasing.linear = (t) => t;
BpxEasing.inQuadratic = (t) => t ** 2;
BpxEasing.outQuadratic = (t) => 1 - (t - 1) ** 2;
BpxEasing.inQuartic = (t) => t ** 4;
BpxEasing.outQuartic = (t) => 1 - (t - 1) ** 4;
