
## How it works?
The system basclly uses a generated data set to recognize a 2D movimentation.

## Setup Train Mode
```javascript
var gesture = new GestureJS(50);
gesture.enableTrain(35);
gesture.onTrainFinished((data)=>{
  //Get data and store to use before.
});
```

