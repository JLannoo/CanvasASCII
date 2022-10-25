const ASCIIMap = [" ", ".", "/", "?", "=", "#", "@"];

export function getASCIIFromBrightness(value){
    const reducedValue = value / 255 * (ASCIIMap.length - 1)
    const index = Math.floor(reducedValue);

    return ASCIIMap[index];
}