export function assertUnreachable(thingThatShouldBeOfTypeNeverAtThisPoint) {
    throw Error(`Somehow reached the unreachable code ¯\\_(ツ)_/¯`);
}
