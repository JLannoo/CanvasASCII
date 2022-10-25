export function map(n, start1, stop1, start2, stop2) {
    return ((n-start1)/(stop1-start1))*(stop2-start2)+start2;
}

export function clampHexValue(value){
    return Math.min(Math.max(value, 0), 255);
}