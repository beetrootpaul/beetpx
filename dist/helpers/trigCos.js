/**
 * @param turnAngle – A full circle turn = 1. In other words: 0 deg = 0 turn, 90 deg = 0.25 turn, 180 deg = 0.5 turn, 270 deg = 0.75 turn.
 */
export function trigCos(turnAngle) {
    return Math.cos(turnAngle * Math.PI * 2);
}
