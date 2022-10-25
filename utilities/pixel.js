import { clampHexValue } from "./utils.js";
import { reduceColorDepth } from "./color.js";

export function getRGBAValues(x , y , pixelSize , data){
    const i = (y * pixelSize * canvas.width + x * pixelSize) * 4;
    return [data[i], data[i+1], data[i+2], data[i+3]];
}

export function getPixelColor(x , y , pixelSize , colorRange , data , brightnessCompensation){
    let [r,g,b,a] = getRGBAValues(x,y,pixelSize,data);

    r = reduceColorDepth(clampHexValue(r + brightnessCompensation), colorRange);
    g = reduceColorDepth(clampHexValue(g + brightnessCompensation), colorRange);
    b = reduceColorDepth(clampHexValue(b + brightnessCompensation), colorRange);

    return `rgb(${r},${g},${b},${a})`;
}

export function getPixelBrightness(x , y , pixelSize , data , brightnessCompensation){
    const [r,g,b] = getRGBAValues(x,y,pixelSize,data);
    
    // As per https://en.wikipedia.org/wiki/Relative_luminance
    const brightness = ((r/255)*0.2126 + (g/255)*0.7152 + (b/255)*0.0722) * 255;
    const compensatedBrightness = brightness + brightnessCompensation;

    return clampHexValue(compensatedBrightness);
}