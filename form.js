import generateImage from './canvas.js';
import { fileDropErrorHandling } from './utilities/error.js';
import { MobileMediaQuery } from './utilities/mediaQueries.js';

const form = document.querySelector("form");

const sideBar = document.querySelector("aside");
const select = document.querySelector("#select");
const linkInput = document.querySelector("#link");
const fileInput = document.querySelector("#file");
const cameraFacing = document.querySelector("#cameraFacing");

const linkGroup = document.querySelector("#link-group");
const fileGroup = document.querySelector("#file-group");
const cameraGroup = document.querySelector("#camera-group");

const colorRangeInput = document.querySelector("#colorDepth");
const numberInput = document.querySelector("#pixelSize");
const asciiCheckbox = document.querySelector("#ascii");
const colorCheckbox = document.querySelector("#color");
const transparencyCheckbox = document.querySelector("#keepTransparency");
const brightnessCompensationRange = document.querySelector("#brightnessCompensation");
const brightnessCompensationValue = document.querySelector("#brightnessCompensationValue");

const error = document.querySelector("#error");

const fileDropOverlay = document.querySelector("dialog");

let generated = false;

let errorTimeOut = null;

select.addEventListener("change", (e) => {
    const value = e.target.value;

    document.querySelector("#link").value = "";
    document.querySelector("#file").value = "";
    document.querySelector("#cameraFacing").value = "user";

    const showLinkInput = value === "link";
    const showFileInput = value === "file";
    const showCameraInput = value === "camera";

    linkGroup.hidden = !showLinkInput;
    fileGroup.hidden = !showFileInput;
    cameraGroup.hidden = !showCameraInput;
});

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    sendGenerateSignal();

    generated = true;
});

MobileMediaQuery.matches ? sideBar.classList.add("dashed-border-horizontal") : sideBar.classList.add("dashed-border-vertical");
MobileMediaQuery.addEventListener("change", (e) => {
    if(e.matches){
        sideBar.classList.add("dashed-border-horizontal");
        sideBar.classList.remove("dashed-border-vertical");
    } else {
        sideBar.classList.remove("dashed-border-horizontal");
        sideBar.classList.add("dashed-border-vertical");
    }
});

document.body.addEventListener("dragover", (e) => {
    e.preventDefault();
    e.stopPropagation();

    fileDropOverlay.open = true;
});
document.body.addEventListener("dragend", (e) => {
    e.preventDefault();
    e.stopPropagation();

    fileDropOverlay.open = false;
});

fileDropOverlay.addEventListener("dragleave", (e) => {
    e.preventDefault();
    e.stopPropagation();
    fileDropOverlay.open = false;
});

fileDropOverlay.addEventListener("drop", (e) => {
    e.preventDefault();
    e.stopPropagation();

    fileDropOverlay.open = false;

    try {
        displayError("");
        fileDropErrorHandling(e);
    } catch (err) {
        return displayError(err.message);
    }
    
    select.value = "file";
    select.dispatchEvent(new Event("change"));

    fileInput.files = e.dataTransfer.files;
});


brightnessCompensationRange.addEventListener("input", (e) => {
    brightnessCompensationValue.textContent = String(e.target.value).padStart(3, "0");
    if(generated){
        sendGenerateSignal();
    }
});

/**
 * Appends event listener to `element` that will trigger a `generateImage` call.
 * @param {Element | HTMLElement} element 
 */
function appendGenerateOnChange(element){
    element.addEventListener("change", (e) => {
        if(generated) {
            sendGenerateSignal();
        }
    });
}
const triggerRegenerateInputs = [colorRangeInput , numberInput, asciiCheckbox, colorCheckbox, transparencyCheckbox];
triggerRegenerateInputs.forEach(appendGenerateOnChange);

/**
 * Send a signal to the background script to generate the image.
 */
function sendGenerateSignal(){
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
        displayError("");
        generateImage(data);
    } catch (err) {
        displayError(err.message);
    }
}

/**
 * Show an error message.
 * @param {String} message 
 */
export function displayError(message){
    const errorContainer = error.parentElement;
    error.innerHTML = message;
    
    if(message === ""){
        errorContainer.classList.remove("show");
        return;    
    };

    const horizontalScalingFactor = MobileMediaQuery.matches ? 1.65 : 1.8;
    
    const errorWidth = errorContainer.offsetWidth;
    const errorHeight = errorContainer.offsetHeight;
    const charWidth = parseFloat(getComputedStyle(errorContainer,':after').getPropertyValue("font-size"));
    const charHeight = parseFloat(getComputedStyle(errorContainer,':after').getPropertyValue("line-height"));
    const charAmountW = Math.round(errorWidth / charWidth) * horizontalScalingFactor;
    const charAmountH = Math.round(errorHeight / charHeight);

    errorContainer.dataset.background = 
        " " + "@".repeat(charAmountW-2) + " \n" +
        ("@".repeat(charAmountW)   +  "\n").repeat(charAmountH-2) +
        " " + "@".repeat(charAmountW-2) + " ";

    if(errorTimeOut){
        clearTimeout(errorTimeOut);
    }

    errorContainer.classList.add("show");
    errorTimeOut = setTimeout(() => {
        errorContainer.classList.remove("show");
    }, 5000);
}