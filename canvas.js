// @ts-check
/**
 * @typedef {Object} CanvasInputData
 * @property {string} link
 * @property {File} file
 * @property {number} pixelSize
 * @property {number} colorDepth
 * @property {boolean} ascii
 * @property {boolean} color
 * @property {boolean} keepTransparency
 * @property {number} brightnessCompensation
 */

import { displayError } from "./form.js";

import { getPixelBrightness , getPixelColor } from "./utilities/pixel.js";
import { errorHandling } from "./utilities/error.js";
import { getASCIIFromBrightness } from "./utilities/ascii.js";

const downloadButton = document.getElementById("downloadButton");
const copyButton = document.getElementById("copyButton");

const canvas = document.querySelector('canvas');
const ctx = canvas?.getContext('2d' , {willReadFrequently: true});

downloadButton?.addEventListener("click", async () => {
    const link = document.createElement("a");
    link.download = "image.png";
    link.href = canvas?.toDataURL("image/png") || "";
    link.click();
});

/**
 * Generate the image with the solicited parameters.
 * @param {CanvasInputData} data 
 */
export default function generateImage(data) {
    const { link, file, pixelSize, colorDepth, ascii, color, keepTransparency , brightnessCompensation} = data;

    errorHandling(data);

    const img = new Image();
    if(link){
        img.src = link;
        img.crossOrigin = "Anonymous";
    }
    if(file.size){
        img.src = URL.createObjectURL(file);
    }

    img.onerror = () => {
        return displayError("Error loading image (probably blocked by CORS)");
    }

    img.onload = () => {
        if(!canvas || !ctx) return displayError("Error loading canvas");

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        if(keepTransparency){
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        } else {
            ctx.fillStyle = "black";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        ctx.textAlign = "center";
        ctx.font = `${pixelSize}px sans-serif`;
        
        for(let y=0; y<canvas.height/pixelSize; y++) {
        for(let x=0; x<canvas.width/pixelSize; x++) {
            const brightness = getPixelBrightness(x,y,pixelSize,data,+brightnessCompensation);
            const char = getASCIIFromBrightness(brightness);

            if(ascii){
                ctx.fillStyle = color ? getPixelColor(x,y,pixelSize,colorDepth,data,+brightnessCompensation) : "white";
                ctx.fillText(char, x*pixelSize, y*pixelSize);
            } else {
                ctx.fillStyle = color ? getPixelColor(x,y,pixelSize,colorDepth,data,+brightnessCompensation) : `rgb(${brightness},${brightness},${brightness})`;
                ctx.fillRect(x*pixelSize, y*pixelSize, pixelSize, pixelSize);
            }
        }
        }
    }

    if(!downloadButton || !copyButton) return displayError("Error loading buttons");

    downloadButton.hidden = false;
    
    if(ascii && !color){
        copyButton.hidden = false;
    } else {
        copyButton.hidden = true;
    }

    copyButton.addEventListener("click", () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if(!canvas || !ctx) return displayError("An error occurred while copying the image");

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        let str = "";

        for(let y=0; y<canvas.height/pixelSize; y++) {
        for(let x=0; x<canvas.width/pixelSize; x++) {
            const brightness = getPixelBrightness(x , y , pixelSize , data , brightnessCompensation);
            const char = getASCIIFromBrightness(brightness);

            str += char;
        }
        str += "\r\n";
        }

        navigator.clipboard.writeText(str);
    });
}
