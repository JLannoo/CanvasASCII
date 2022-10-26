import generateImage from './canvas.js';

const form = document.querySelector("form");
const select = document.querySelector("#select");
const colorRangeInput = document.querySelector("#colorDepth");
const numberInput = document.querySelector("#pixelSize");
const asciiCheckbox = document.querySelector("#ascii");
const colorCheckbox = document.querySelector("#color");
const transparencyCheckbox = document.querySelector("#keepTransparency");
const brightnessCompensationRange = document.querySelector("#brightnessCompensation");
const brightnessCompensationValue = document.querySelector("#brightnessCompensationValue");

const error = document.querySelector("#error");

let generated = false;

select.addEventListener("change", (e) => {
    const value = e.target.value;

    document.querySelector("#link").value = "";
    document.querySelector("#file").value = "";

    if(value === "file"){
        document.querySelector("#file-group").hidden = false;
        document.querySelector("#link-group").hidden = true;
    } else {
        document.querySelector("#file-group").hidden = true;
        document.querySelector("#link-group").hidden = false;
    }
});

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    sendGenerateSignal();

    generated = true;
})

brightnessCompensationRange.addEventListener("input", (e) => {
    brightnessCompensationValue.textContent = e.target.value;
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
        displayError(err);
    }
}

/**
 * Show an error message.
 * @param {String} message 
 */
export function displayError(message){
    error.innerHTML = message;
}