export class BpxEasing {
}
BpxEasing.linear = (t) => t;
BpxEasing.inQuadratic = (t) => Math.pow(t, 2);
BpxEasing.outQuadratic = (t) => 1 - Math.pow((t - 1), 2);
BpxEasing.inQuartic = (t) => Math.pow(t, 4);
BpxEasing.outQuartic = (t) => 1 - Math.pow((t - 1), 4);
