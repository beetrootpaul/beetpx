export function wait(millis) {
    return new Promise((resolve) => {
        setTimeout(() => resolve(), millis);
    });
}
