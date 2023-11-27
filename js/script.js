const BRUSH_TIME = 1500;
const activeToolEl = document.getElementById("active-tool");
const brushColorBtn = document.getElementById("brush-color");
const brushIcon = document.getElementById("brush");
const brushSize = document.getElementById("brush-size");
const brushSlider = document.getElementById("brush-slider");
const bucketColorBtn = document.getElementById("bucket-color");
const eraser = document.getElementById("eraser");
const clearCanvasBtn = document.getElementById("clear-canvas");
const saveStorageBtn = document.getElementById("save-storage");
const loadStorageBtn = document.getElementById("load-storage");
const clearStorageBtn = document.getElementById("clear-storage");
const downloadBtn = document.getElementById("download");

const body = document.querySelector("body");

const canvas = document.createElement("canvas");
canvas.id = "canvas";
const context = canvas.getContext("2d");

let currentSize = 10;

let bucketColor = "#ffffff";
let currentColor = "#A51DAB";
let isEraser = false;
let isMouseDown = false;
let drawArray = [];

//Show Brush size
function displayBrushSize(){
    if(brushSlider.value < 10){
        brushSize.textContent = `0${brushSlider.value}`;
    }else{
        brushSize.textContent = brushSlider.value;
    }
}

/* Setting brush size */
brushSlider.addEventListener("change",() =>{
    currentSize = brushSlider.value;
    displayBrushSize();
});

/* Setting brush color */
brushColorBtn.addEventListener("change",() =>{
    isEraser = false;
    currentColor = `#${brushColorBtn.value}`;
});

/* Setting Background color */
bucketColorBtn.addEventListener("change",() =>{
    bucketColor = `#${bucketColorBtn.value}`;
    createCanvas();
    restoreCanvas();
});

/* Setting eraser */
eraser.addEventListener("click",() =>{
    isEraser = true;
    brushIcon.style.color = "white";
    eraser.style.color = "black";
    activeToolEl.textContent = "Eraser";
    currentColor = bucketColor;
    currentSize = 50;
});

/* Setting brush */
brushIcon.addEventListener("click",switchToBrush);

// switch to brush
function switchToBrush(){
    isEraser = false;
    brushIcon.style.color = "black";
    eraser.style.color = "white";
    activeToolEl.textContent = "Brush";
    currentColor = `#${bucketColorBtn.value}`;
    currentSize = 10;
    brushSlider.value = 10;
    displayBrushSize();
}

function brushTimeSetTimeout(ms){
    setTimeout(switchToBrush, ms);
}

//draw what is stored in drawnArray
function restoreCanvas(){
    for(let i = 1; i < drawArray.length; i++){
        context.beginPath();
        context.moveTo(drawArray[i-1].x, drawArray[i-1].y);
        context.lineWidth = drawArray[i].size;
        context.lineCap = 'round';
        if(drawArray[i].eraser){
            context.strokeStyle = bucketColor;
        }else{
            context.strokeStyle = drawArray[i].color;
        }
        context.lineTo(drawArray[i].x,drawArray[i].y);
        context.stroke();
    }
}

// store drawing lines in drawnArray
function storeDrawn(x, y, size, color, erase){
    const line = {
        x,
        y,
        size,
        color,
        erase,
    };
    console.log(line);
    drawArray.push(line);
}

//get mouse position
function getMousePosition(event){
    const boundaries = canvas.getBoundingClientRect();
    return{
        x: event.clientX - boundaries.left,
        y: event.clientY - boundaries.top,
    };
}

// mouse down
canvas.addEventListener("mousedown",(event)=>{
    isMouseDown = true;
    const currentPosition = getMousePosition(event);
    context.moveTo(currentPosition.x,currentPosition.y);
    context.beginPath();
    context.lineWidth = currentSize;
    context.lineCap = 'round';
    context.strokeStyle = currentColor;
});

//mouse move
canvas.addEventListener("mousemove",(event) =>{
    if(isMouseDown){
        const currentPosition = getMousePosition(event);
        context.lineTo(currentPosition.x, currentPosition.y);
        context.stroke();
        storeDrawn(
            currentPosition.x,
            currentPosition.y,
            currentSize,
            currentColor,
            isEraser,
        );
    }else{
        storeDrawn(undefined);
    }
});

//mouse up
canvas.addEventListener("mouseup",()=>{
    isMouseDown = false;
});

//save to local storage
saveStorageBtn.addEventListener("click",()=>{
    localStorage.setItem("savedCanvas",JSON.stringify(drawArray));
    activeToolEl.textContent = "canvas saved";
    brushTimeSetTimeout(BRUSH_TIME);
});

//load to local storage
loadStorageBtn.addEventListener("click",()=>{
    if(localStorage.getItem("savedCanvas")){
        drawArray = JSON.parse(localStorage.savedCanvas);
        restoreCanvas();
        activeToolEl.textContent = "canvas loaded";
        brushTimeSetTimeout(BRUSH_TIME);
    }else{
        activeToolEl.textContent = "No canvas found";
        brushTimeSetTimeout(BRUSH_TIME);
    }
});

// clear local storage
clearStorageBtn.addEventListener("click",()=>{
    localStorage.removeItem("savedCanvas");
    activeToolEl.textContent = "Local storage cleared";
    brushTimeSetTimeout(BRUSH_TIME);
});
// download image
downloadBtn.addEventListener("click",()=>{
    downloadBtn.href = canvas.toDataURL("image/jpeg",1);
    downloadBtn.download = "Draw-example.jpeg";
    activeToolEl.textContent = "Image file saved";
    brushTimeSetTimeout(BRUSH_TIME);
});

function createCanvas(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - 50;
    context.fillStyle = bucketColor;
    context.fillRect(0, 0, canvas.width,canvas.height);
    body.appendChild(canvas);
    switchToBrush();
}

// clear canvas
clearCanvasBtn.addEventListener("click",()=>{
    createCanvas();
    drawArray = [];
    activeToolEl.textContent = "Canvas cleared";
    brushTimeSetTimeout(BRUSH_TIME);
});

createCanvas();