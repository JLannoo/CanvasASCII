import { map } from "./utils.js";

export function reduceColorDepth(value, range){
    const reducedValue = map(value, 0, 255, 0, range);
    const roundedValue = Math.round(reducedValue);
    
    return roundedValue * (255/range);
}