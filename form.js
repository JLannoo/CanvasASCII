import generateImage from './canvas.js';

const form = document.querySelector("form");
const select = document.querySelector("#select");
const colorRangeInput = document.querySelector("#colorRange");
const numberInput = document.querySelector("#pixel");
const asciiCheckbox = document.querySelector("#ascii");
const colorCheckbox = document.querySelector("#color");

const error = document.querySelector("#error");

let generated = false;

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    sendGenerateSignal();

    generated = true;
})

select.addEventListener("change", (e) => {
    const value = e.target.value;

    if(value === "file"){
        document.querySelector("#file-group").hidden = false;
        document.querySelector("#link-group").hidden = true;
    } else {
        document.querySelector("#file-group").hidden = true;
        document.querySelector("#link-group").hidden = false;
    }
});

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
    const file = formData.get("file");
    const pixelSize = formData.get("pixel");
    const colorRange = formData.get("colorRange");
    const ascii = formData.get("ascii");
    const color = formData.get("color");

    try {
        generateImage(link, file, +pixelSize, +colorRange, ascii, color);
        error.innerHTML = "";
    } catch (err) {
        error.innerHTML = err.message;
    }
}