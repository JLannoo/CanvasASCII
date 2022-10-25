const ASCIIMap = [" ", ".", "/", "?", "=", "#", "@"];

/**
 * Returns a ASCII character based on the given brightness value;
 * @param {Number} value 
 * @returns {String} Char
 */
export function getASCIIFromBrightness(value){
    const reducedValue = value / 255 * (ASCIIMap.length - 1)
    const index = Math.floor(reducedValue);

    return ASCIIMap[index];
}