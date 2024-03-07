/**
 * @param turnAngle – A full circle turn = 1. In other words: 0 deg = 0 turn, 90 deg = 0.25 turn, 180 deg = 0.5 turn, 270 deg = 0.75 turn.
 */
export function trigSin(turnAngle) {
    return Math.sin(turnAngle * Math.PI * 2);
}
