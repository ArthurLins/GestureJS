
## How it works?
Example: https://arthurlins.github.io/GestureJS/index.html

## Setup Recognition Mode
```javascript
//Bind mouse events
var drawing = false;
window.onmousedown = function(){
    if (drawing){
        return;
    }
    gesture.start(); //Start mouse capture
    drawing = true;
}
window.onmouseup = function(){
    if (!drawing){
        return;
    }
    drawing = false;
    gesture.stop(); //Stop movment recording and save;
}
document.onmousemove = function(event){
    mouseEvent = event;
}
setInterval(()=>{
    if (!drawing){
        return; 
    }
    gesture.store(mouseEvent.clientX, mouseEvent.clientY); //Store coord's evry mouse moves.
}, 5);

gesture.on({TRAINED_DATA}, {Confidence needed [0..1]},(confidence)=>{
  //Callback
});
```
## Setup Train Mode
```javascript
var gesture = new GestureJS(30); // 50 is a resolution
gesture.enableTrain(35); // 35 is a quantity of samples to be captured to finalize process

//Bind mouse events
var drawing = false;
window.onmousedown = function(){
    if (drawing){
        return;
    }
    gesture.start(); //Start mouse capture
    drawing = true;
}
window.onmouseup = function(){
    if (!drawing){
        return;
    }
    drawing = false;
    gesture.stop(); //Stop movment recording and save;
}
document.onmousemove = function(event){
    mouseEvent = event;
}
setInterval(()=>{
    if (!drawing){
        return; 
    }
    gesture.store(mouseEvent.clientX, mouseEvent.clientY); //Store coord's evry mouse moves.
}, 5);

gesture.onTrainFinished((data)=>{
  //Get data and store to use before.
});
```

