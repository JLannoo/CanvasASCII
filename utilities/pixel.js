// @ts-check
import { clampHexValue } from "./utils.js";
import { reduceColorDepth } from "./color.js";

/**
 * Gets the RGBA values of a pixel at a given position in a given image.
 * @param {Number} x 
 * @param {Number} y 
 * @param {Number} pixelSize 
 * @param {Uint8ClampedArray} data 
 * @returns {Number[]} RGBA values in the form [r,g,b,a]
 */
export function getRGBAValues(x , y , pixelSize , data ){
    // @ts-ignore-next-line (I should probably fix this)
    const i = (y * pixelSize * canvas.width + x * pixelSize) * 4;

    return [data[i], data[i+1], data[i+2], data[i+3]];
}

/**
 * Returns the color of a pixel at a given position in a given image in the form rgba(r,g,b,a).
 * @param {Number} x
 * @param {Number} y
 * @param {Number} pixelSize
 * @param {Number} colorRange
 * @param {Uint8ClampedArray} data 
 * @param {Number} brightnessCompensation 
 * @returns {String} rgba(r,g,b,a)
 */
export function getPixelColor(x , y , pixelSize , colorRange , data , brightnessCompensation){
    let [r,g,b,a] = getRGBAValues(x,y,pixelSize,data);

    r = reduceColorDepth(clampHexValue(r + brightnessCompensation), colorRange);
    g = reduceColorDepth(clampHexValue(g + brightnessCompensation), colorRange);
    b = reduceColorDepth(clampHexValue(b + brightnessCompensation), colorRange);

    return `rgb(${r},${g},${b},${a})`;
}

/**
 * Returns the brightness of a pixel at a given position in a given image.
 * @param {Number} x 
 * @param {Number} y 
 * @param {Number} pixelSize 
 * @param {Uint8ClampedArray} data 
 * @param {Number} brightnessCompensation 
 * @returns {Number} Brightness value (0-255)
 */
export function getPixelBrightness(x , y , pixelSize , data , brightnessCompensation){
    const [r,g,b] = getRGBAValues(x,y,pixelSize,data);
    
    // As per https://en.wikipedia.org/wiki/Relative_luminance
    const brightness = ((r/255)*0.2126 + (g/255)*0.7152 + (b/255)*0.0722) * 255;
    const compensatedBrightness = brightness + brightnessCompensation;

    return clampHexValue(compensatedBrightness);
}