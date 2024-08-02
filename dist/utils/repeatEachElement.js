export function repeatEachElement(times, array) {
    times = times > 0 ? Math.round(times) : 0;
    const newArray = new Array(times * array.length);
    for (let i = 0; i < newArray.length; i++) {
        newArray[i] = array[Math.floor(i / times)];
    }
    return newArray;
}
//# sourceMappingURL=repeatEachElement.js.map