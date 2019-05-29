

class GestureJS {
    
    constructor(_captureResolution) {
        this.captureResolution = _captureResolution;
        
        this.train = false;

        this.moves = [];

        this.binds = [];

        //Train
        this.trainSamples =[];
        this.maxSamplesQtd = 50;
        this.actualSampleQtd = 1;
        this.trainFinishedCallbacks = [];

        this.directions = {
            UP: 1,
            UP_LEFT: 2,
            UP_RIGHT: 3,
            DOWN: 4,
            DOWN_LEFT: 5,
            DOWN_RIGHT: 6,
            LEFT: 7,
            RIGHT: 8,
        }


    }

    removeConsecutiveNumbers(_data){
        var last = null;
        var result = [];
        for (var i = 0; i < _data.length; i++){
            if (!(last != null && last == _data[i])){
                last = _data[i];
                result.push(last);
            }
        }
        return result;
    }

    start(){
        this.moves = [];
    }

    store(_x,_y){
        var newData = [_x,_y];
        var moves = this.moves;
        if (moves.length == 0 || moves[moves.length - 1].length == this.captureResolution){
            moves.push([newData]);
            return;
        } 
        if (moves[moves.length - 1].length < this.captureResolution){
            moves[moves.length - 1].push(newData);
        }
    }

    isMap(dist, map){
        var ine = this.removeConsecutiveNumbers(dist);
        var score = 0;
        var consecutiveUnmatch = false;
        for (var i = 0; i < ine.length; i++){
            var e = ine[i];
            if (map[i] !== undefined && map[i][0] == e){
                score += (map[i][1]);
                consecutiveUnmatch = false;
            } else {
                score -= 1;
                if (consecutiveUnmatch){
                    score -= 2;
                }
                consecutiveUnmatch = true;
            }
        }
        var old_max = 0;
        var old_min = 0;
        for (var i = 0; i < map.length; i++){
            old_max += map[i][1];
        }
        
        old_min -= (1 + (3 * dist.length));

        return (( score - old_min )/(old_max - old_min)) * 1;
    }


    stop(){
        var self = this;
        var processedMoves = this.processMoves();
        if (this.train){
            this.processTrain(processedMoves);
        } else {
            this.binds.forEach((bind)=>{
                var confidence = self.isMap(processedMoves, bind[0]);
                if (confidence >= bind[1]){
                    if (typeof bind[2] === "function"){
                        bind[2](confidence);
                    }
                }
            });
        }
    }

    enableTrain(_maxSamplesQtd){
        if (_maxSamplesQtd === undefined){
            this.maxSamplesQtd = 50;
        } else {
            this.maxSamplesQtd = _maxSamplesQtd;
        }
        this.train = true;
    }

    processTrain(moves){
        var samples = this.trainSamples;
        for (var f = 0; f < moves.length; f++){
            var e = moves[f];
            if (samples[f] !== undefined){
                if (samples[f][0] == e){
                    samples[f][1] += 2;
                } else {
                    samples[f][1] -= 1;
                    if (samples[f][1] < 0){
                        samples[f][0] = e;
                        samples[f][1] = 0;
                    }
                }
            } else {
                samples[f] = [e, 1];
            }
        }

        if (this.actualSampleQtd == this.maxSamplesQtd){
            var res = [];
            for (var i = 0; i < samples.length; i++){
                if (samples[i][1] > 0){
                    res.push(samples[i]);
                }
            }
            this.trainFinishedCallbacks.forEach((cb)=>{
                cb(res);
            });
            samples = [];
            this.actualSampleQtd = 1;
            return;
        }
        //Print
            var progressbar = "Train progress: [";
            for (var i = 0; i<= this.maxSamplesQtd; i++){
                if (i <= this.actualSampleQtd){
                    progressbar +="."
                } else {
                    progressbar += " "
                }
            }
            progressbar+="]";
            console.clear();
            console.log(progressbar);
        //

        this.actualSampleQtd++;
        
    }

    processMoves(){
        if (this.moves.length == 0){
            return [];
        }
        var directions = this.directions;
        var dirs = [];
        for (var i = 0; i < this.moves.length; i++){
            var c = this.moves[i];
            //Initial point
            var p1 = c[0];
            //Final point
            var p2 = c[c.length - 1];

            var angle = parseInt(Math.atan2((parseFloat(p1[1]) - parseFloat(p2[1])),(parseFloat(p1[0]) - parseFloat(p2[0]))) * 180 / Math.PI);
        
            if (angle >= 70 && angle <= 110){
                dirs.push(directions.UP);
            }
            else if (angle <= 70 && angle >= 20){
                dirs.push(directions.UP_LEFT);
            }
            else if (angle >= 110 && angle <= 160){
                dirs.push(directions.UP_RIGHT);
            } 
            else if ((angle <= 20 && angle >= 0) ){
                dirs.push(directions.LEFT);
            }
            else if ((angle >= 160 && angle <= 180)){
                dirs.push(directions.RIGHT);
            }            
            else if (angle <= -70 && angle >= -110){
                dirs.push(directions.DOWN);
            }
            else if (angle >= -70 && angle <= -20){
                dirs.push(directions.DOWN_LEFT);
            }
            else if (angle <= -110 && angle >= -160){
                dirs.push(directions.DOWN_RIGHT);                   
            }
        }
        //like: [1,2,3,1,1,1,2,4];
        return dirs;
    }


    onTrainFinished(_callback){
        if (typeof _callback === "function"){
            this.trainFinishedCallbacks.push(_callback);
        }
    }

    on(_gestureData, _confidence,_callback) {
        if (_confidence > 1 || _confidence < 0){
            console.error("Confidence is a number 0..1");
            return;
        }
        this.binds.push([_gestureData, _confidence, _callback]);
    }
}

