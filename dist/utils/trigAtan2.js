export function trigAtan2(x, y) {
    return (Math.atan2(y, x) / Math.PI / 2 + 1) % 1;
}
