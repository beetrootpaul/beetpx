export function clamp(a, b, c) {
    return a < b ? (b < c ? b : a < c ? c : a) : b > c ? b : a > c ? c : a;
}
//# sourceMappingURL=clamp.js.map