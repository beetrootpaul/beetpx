/**
 * This function is meant to be used in a last branch of `if - else if - … - else`
 *   chain or in `default` of `switch - case - case - …`. Let's imagine there is
 *   a union type of which we check all possible cases. Someday we add one more
 *   type to the union, but we forget to extend our `switch` by that one more `case`.
 *   Thanks to `assertUnreachable(theValueOfThatUnionType)` the TypeScript checker
 *   will inform us about such mistake.
 *
 * @param thingThatShouldBeOfTypeNeverAtThisPoint - a value which we expect to be of type never
 */
export function assertUnreachable(thingThatShouldBeOfTypeNeverAtThisPoint) {
    throw Error(`Somehow reached the unreachable code ¯\\_(ツ)_/¯`);
}
