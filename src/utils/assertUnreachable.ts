export function assertUnreachable(
  thingThatShouldBeOfTypeNeverAtThisPoint: never,
): void {
  throw Error(`Somehow reached the unreachable code ¯\\_(ツ)_/¯`);
}
