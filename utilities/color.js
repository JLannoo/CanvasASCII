// @ts-check
import { map } from "./utils.js";

/**
 * Rounds a given number between 0 and 255 to the nearest step of size `255/range`.
 * 
 * Effectively reducin the "bit depth" of the number.
 * 
 * Example:
 * 
 * `reducedColorDepth(255, 4)` returns `255`.
 * 
 * `reducedColorDepth(140, 4)` returns `127`.
 * 
 * @param {Number} value (0-255)
 * @param {Number} range (1-255)
 * @returns {Number} Stepped value (0-255)
 */
export function reduceColorDepth(value, range){
    const reducedValue = map(value, 0, 255, 0, range);
    const roundedValue = Math.round(reducedValue);
    
    return roundedValue * (255/range);
}