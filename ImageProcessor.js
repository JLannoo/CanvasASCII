// @ts-check
import { displayError } from "./form.js";

import { getPixelBrightness, getPixelColor } from "./utilities/pixel.js";
import { errorHandling } from "./utilities/error.js";
import { getASCIIFromBrightness } from "./utilities/ascii.js";
import { getCameraData as getCameraSnapshot } from "./utilities/camera.js";

/**
 * @typedef {Object} ImageProcessorInput
 * @property {string} link
 * @property {File} file
 * @property {"user" | "environment"} cameraFacing
 * @property {"link" | "file" | "camera"} type
 * 
 * @typedef {Object} ImageProcessorConfig
 * @property {number} pixelSize
 * @property {number} colorDepth
 * @property {boolean} ascii
 * @property {boolean} color
 * @property {boolean} keepTransparency
 * @property {number} brightnessCompensation
 */
export class ImageProcessor {
    constructor() {
        this.buttons = {
            download: document.getElementById("downloadButton"),
            copy: document.getElementById("copyButton")
        };

        this.canvas = document.querySelector('canvas');
        this.ctx = this.canvas?.getContext('2d', { willReadFrequently: true });
        if(this.ctx) {
            this.ctx.textAlign = "center";
        }

        this.input = undefined;
        this.imageBuffer = undefined;

        this.buttons.download?.addEventListener("click", () => this.downloadImage());
        this.buttons.copy?.addEventListener("click", () => this.copyImage());

        /** @type {ImageProcessorConfig} */
        this.config = {
            pixelSize: 5,
            colorDepth: 4,
            ascii: true,
            color: false,
            keepTransparency: false,
            brightnessCompensation: 0
        };
    }

    /**
     * @param {ImageProcessorInput} input
     */
    async loadImageBuffer(input) {
        try {
            this.input = input;
            errorHandling(input, this.config);
            this.imageBuffer = await this.loadImage(input);
        } catch (error) {
            displayError(error);
        }
    }

    process() {
        if (!this.imageBuffer || !this.input) throw new Error("No image loaded");
        errorHandling(this.input, this.config);
        this.drawCanvas();
    }

    /**
     * @param {ImageProcessorInput} input
     */
    loadImage(input) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            
            if (input.type === "link" && input.link) {
                img.src = input.link;
                img.crossOrigin = "Anonymous";
            }
            if (input.type === "file" && input.file.size) {
                img.src = URL.createObjectURL(input.file);
            }
            if (input.type === "camera" && input.cameraFacing) {
                getCameraSnapshot(input.cameraFacing).then((data) => {
                    img.src = data;
                });
            }

            img.onload = () => {
                console.log("Image loaded");
                console.log(img.width, img.height);
                resolve(img);
            }
            img.onerror = () => reject("Error loading image (probably blocked by CORS)");
        });
    }

    drawCanvas() {
        if (!this.canvas || !this.ctx) return displayError("Error loading canvas");

        this.canvas.width = this.imageBuffer.width;
        this.canvas.height = this.imageBuffer.height;

        console.log(this.canvas.width, this.canvas.height);

        this.ctx.drawImage(this.imageBuffer, 0, 0, this.imageBuffer.width, this.imageBuffer.height);

        const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        const data = imageData.data;

        if (this.config.keepTransparency) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        } else {
            this.ctx.fillStyle = "black";
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }
        
        this.ctx.font = `${this.config.pixelSize}px sans-serif`;

        for (let y = 0; y < this.canvas.height / this.config.pixelSize; y++) {
            for (let x = 0; x < this.canvas.width / this.config.pixelSize; x++) {
                const brightness = getPixelBrightness(x, y, this.config.pixelSize, data, this.config.brightnessCompensation);
                const color = getPixelColor(x, y, this.config.pixelSize, this.config.colorDepth, data, this.config.brightnessCompensation);
                
                if(this.config.color) {
                    this.ctx.fillStyle = color;
                } else if (this.config.ascii) {
                    this.ctx.fillStyle = "white";
                } else {
                    this.ctx.fillStyle = `rgb(${brightness}, ${brightness}, ${brightness})`;
                }

                if (this.config.ascii) {
                    const ascii = getASCIIFromBrightness(brightness);
                    this.ctx.fillText(ascii, x * this.config.pixelSize, y * this.config.pixelSize);
                } else {
                    this.ctx.fillRect(x * this.config.pixelSize, y * this.config.pixelSize, this.config.pixelSize, this.config.pixelSize);
                }
            }
        }

        if(this.buttons.download) this.buttons.download.hidden = false;
        if(this.config.ascii && !this.config.color && this.buttons.copy) this.buttons.copy.hidden = false;

        this.canvas.hidden = false;
    }

    downloadImage() {
        if (!this.canvas) return displayError("Error loading canvas");

        const link = document.createElement("a");
        link.href = this.canvas.toDataURL("image/png");
        link.download = "ascii.png";
        link.click();
    }

    copyImage() {
        if (!this.canvas) return displayError("Error loading canvas");

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (!canvas || !ctx) return displayError("An error occurred while copying the image");

        canvas.width = this.imageBuffer.width;
        canvas.height = this.imageBuffer.height;
        ctx.drawImage(this.imageBuffer, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        const ascii = this.canvas.toDataURL("image/png");
        navigator.clipboard.writeText(ascii);
    }
}