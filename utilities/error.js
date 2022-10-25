export function errorHandling(data){
    if(!data.link && !data.file.size) throw new Error("No link or file provided");

    if(data.pixelSize <= 0) throw new Error("Pixel size must be greater than 0");

    if(data.colorDepth <= 0) throw new Error("Color depth must be greater than 0");
    if(data.colorDepth > 255) throw new Error("Color depth must be less than 256");
}