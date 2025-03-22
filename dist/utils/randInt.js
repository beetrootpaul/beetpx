import { rand } from "./rand";
export function randInt(minInclusive, maxExclusive) {
    return Math.floor(rand(Math.ceil(minInclusive), Math.floor(maxExclusive)));
}
//# sourceMappingURL=randInt.js.map