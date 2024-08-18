// @ts-check

/**
 * @typedef {import ("../ImageProcessor").ImageProcessorInput} ImageProcessorInput
 * @typedef {import ("../ImageProcessor").ImageProcessorConfig} ImageProcessorConfig
 */

/**
 * Throw error if the data passed is not valid.
 * @param {ImageProcessorInput} input
 * @param {ImageProcessorConfig} config
 */
export function errorHandling(input, config) {
    if(!input.link && !input.file.size && input.type !== "camera") throw new Error("No link or file provided");

    if(config.pixelSize <= 0) throw new Error("Pixel size must be greater than 0");

    if(config.colorDepth <= 0) throw new Error("Color depth must be greater than 0");
    if(config.colorDepth > 255) throw new Error("Color depth must be less than 256");
}

/**
 * Throw error if the files dropped are not valid.
 * @param {DragEvent} e 
 */
export function fileDropErrorHandling(e){
    if(e && e.dataTransfer && e.dataTransfer.items){
        if(e.dataTransfer.items[0].kind !== "file") throw new Error("Only files can be dropped");
        
        if(e.dataTransfer.items.length !== 1) throw new Error("Only one file can be dropped at a time");

        if(!e.dataTransfer.items[0].type.startsWith("image/")) throw new Error("Only images can be dropped");    
    } else {
        throw new Error("Error while reading dropped files");
    }
}