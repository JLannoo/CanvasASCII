import generateImage from './canvas.js';

const form = document.querySelector("form");
const colorRangeInput = document.querySelector("#colorRange");
const numberInput = document.querySelector("#pixel");
const asciiCheckbox = document.querySelector("#ascii");
const colorCheckbox = document.querySelector("#color");

let generated = false;

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    sendGenerateSignal();

    generated = true;
})

numberInput.addEventListener("change", (e) => {
    if(generated) {
        sendGenerateSignal();
    }
});

colorRangeInput.addEventListener("change", (e) => {
    if(generated) {
        sendGenerateSignal();
    }
});

colorCheckbox.addEventListener("change", (e) => {
    if(generated) {
        sendGenerateSignal();
    }
});

asciiCheckbox.addEventListener("change", (e) => {
    if(generated) {
        sendGenerateSignal();
    }
});

function sendGenerateSignal(){
    const formData = new FormData(form);
    const link = formData.get("link");
    const pixelSize = formData.get("pixel");
    const colorRange = formData.get("colorRange");
    const ascii = formData.get("ascii");
    const color = formData.get("color");

    generateImage(link, +pixelSize, +colorRange, ascii, color);
}