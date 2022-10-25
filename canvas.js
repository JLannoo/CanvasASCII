const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const ASCIIMap = [" ", ".", "/", "?", "=", "#", "@"];

export default function generateImage(link , file , pixelSize, colorDepth, ascii, color) {
    errorHandling(link , file , pixelSize, colorDepth, ascii, color);

    const img = new Image();
    if(link){
        img.src = link;
        img.crossOrigin = "Anonymous";
    }
    if(file.size){
        img.src = URL.createObjectURL(file);
    }

    img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.textAlign = "center";
        ctx.font = `${pixelSize}px sans-serif`;
        
        // loop through each pixel and change the color
        for(let y=0; y<canvas.height/pixelSize; y++) {
        for(let x=0; x<canvas.width/pixelSize; x++) {
            const brightness = getPixelBrightness(x,y,pixelSize,data);
            const char = getASCIIFromBrightness(brightness);

            if(ascii){
                ctx.fillStyle = color ? getPixelColor(x,y,pixelSize,colorDepth,data) : "white";
                ctx.fillText(char, x*pixelSize, y*pixelSize);
            } else {
                ctx.fillStyle = color ? getPixelColor(x,y,pixelSize,colorDepth,data) : `rgb(${brightness},${brightness},${brightness})`;
                ctx.fillRect(x*pixelSize, y*pixelSize, pixelSize, pixelSize);
            }
        }
        }
    }
}

function getRGBValues(x,y,pixelSize,data){
    const i = (y * pixelSize * canvas.width + x * pixelSize) * 4;
    return [data[i], data[i+1], data[i+2]];
}

function reduceColorRange(value, range){
    const reducedValue = map(value, 0, 255, 0, range);
    const roundedValue = Math.round(reducedValue);
    
    return roundedValue * (255/range);
}

function getPixelColor(x , y , pixelSize , colorRange , data){
    let [r,g,b] = getRGBValues(x,y,pixelSize,data);

    r = reduceColorRange(r, colorRange);
    g = reduceColorRange(g, colorRange);
    b = reduceColorRange(b, colorRange);

    return `rgb(${r},${g},${b})`;
}

function getPixelBrightness(x,y,pixelSize,data){
    const [r,g,b] = getRGBValues(x,y,pixelSize,data);
    
    // As per https://en.wikipedia.org/wiki/Relative_luminance
    const brightness = ((r/255)*0.2126 + (g/255)*0.7152 + (b/255)*0.0722) * 255;

    return brightness;
}

function getASCIIFromBrightness(value){
    const reducedValue = value / 255 * (ASCIIMap.length - 1)
    const index = Math.floor(reducedValue);

    return ASCIIMap[index];
}


function map(n, start1, stop1, start2, stop2) {
    return ((n-start1)/(stop1-start1))*(stop2-start2)+start2;
}

function errorHandling(link , file , pixelSize, colorDepth, ascii, color){
    if(!link && !file.size) throw new Error("No link or file provided");

    if(pixelSize <= 0) throw new Error("Pixel size must be greater than 0");

    if(colorDepth <= 0) throw new Error("Color depth must be greater than 0");
    if(colorDepth > 255) throw new Error("Color depth must be less than 256");
}