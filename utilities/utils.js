// @ts-check

/**
 * Maps a value `n` from a range `a`-`b` to a range `c`-`d`.
 * @param {Number} n 
 * @param {Number} start1 
 * @param {Number} stop1 
 * @param {Number} start2 
 * @param {Number} stop2 
 * @returns 
 */
export function map(n, start1, stop1, start2, stop2) {
    return ((n-start1)/(stop1-start1))*(stop2-start2)+start2;
}

/**
 * Clamps a value between 0-255.
 * @param {Number} value 
 * @returns {Number} Clamped value (0-255)
 */
export function clampHexValue(value){
    return Math.min(Math.max(value, 0), 255);
}