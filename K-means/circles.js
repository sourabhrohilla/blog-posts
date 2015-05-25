// Circle Constructor
var centroids;
var theCanvas;
var canvasContext;
var context;
var numCircle = 50;
var minDist;
var circleArray;
var radR = 6;
var color_arr;

function Circle(x,y,r,color) {
    this.x = x;
    this.y = y;
    this.r = r;
    // I've added the drawing code to the actual circle
    // they can draw themselves.
    this.draw = function(context){
        context.beginPath();
        context.arc(this.x, this.y, this.r, 0, Math.PI*2, true);
        context.closePath();
        context.fillStyle = color;
        context.fill();
    }
}

// Create array and fill it with Circles
function init(){
    theCanvas=document.getElementById("myCanvas");
    canvasContext=theCanvas.getContext("2d");

    circleArray = [];
    centroids = [];
    color_arr = [];
    for (var i=0; i<numCircle; i++){
        var radX = (Math.random()*(theCanvas.width - 6)) + 1;
        var radY = (Math.random()* (theCanvas.height - 6)) + 1;
        circleArray.push(new Circle(radX, radY, radR, "black"));
    }


    // loop through and draw all circles in the array
    for(var i=0; i<numCircle; i++) {
           circleArray[i].draw(canvasContext);
    }
}

function initializeCentroids(e){
    var pos = getMousePos(theCanvas, e);
    posx = pos.x;
    posy = pos.y;
    new_centroid = new Circle(posx, posy, radR, "red");
    centroids.push(new_centroid);
    new_centroid.draw(canvasContext);
}

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
}

function recomputeCentroids(cluster_dict){
    num_centroids = Object.keys(cluster_dict).length;
    for(var k=0;k<centroids.length;k++){
        old_centroid = new Circle(centroids[k].x, centroids[k].y, radR + 1, "white");
        old_centroid.draw(canvasContext);
    }
    for(var i=0;i<num_centroids;i++){
        sum_x = 0;
        sum_y = 0;
        for(var j=0;j<cluster_dict[i]['elem'].length;j++){
            sum_x += cluster_dict[i]['elem'][j].x;
            sum_y += cluster_dict[i]['elem'][j].y;
        }
        centroids[i].x = sum_x/cluster_dict[i]['elem'].length;
        centroids[i].y = sum_y/cluster_dict[i]['elem'].length;
    }
    for(var k=0;k<centroids.length;k++){
        new_centroid = new Circle(centroids[k].x, centroids[k].y, radR, "red");
        new_centroid.draw(canvasContext);
    }
}

function redrawClusters(){
    cluster_dict = computeKMeans();
    num_centroids = Object.keys(cluster_dict).length;
    for(var i=0;i<num_centroids;i++){
        console.log("Here");
        for(var j=0;j<cluster_dict[i]['elem'].length;j++){
            temp_circle = new Circle(cluster_dict[i]['elem'][j].x,cluster_dict[i]['elem'][j].y, radR, cluster_dict[i]['color']);
            console.log(temp_circle);
            temp_circle.draw(canvasContext);
        }
    }
    recomputeCentroids(cluster_dict);
}

function computeKMeans(){
    var cluster_dict = {}
    colorEachCentroid(centroids.length);
    for(var k=0;k<centroids.length;k++){
        cluster_dict[k] = {}
        cluster_dict[k]['centroid'] = centroids[k]
        cluster_dict[k]['elem'] = []
        cluster_dict[k]['color'] = color_arr[k];
    }
    for(var i=0; i < circleArray.length; i++){
        var centroid_index = 0;
        for(var j=0;j<centroids.length;j++){
            if(j==0){
                minDist = calculateDistance(centroids[j].x,centroids[j].y,circleArray[i].x,circleArray[i].y);
            }
            temp = calculateDistance(centroids[j].x,centroids[j].y,circleArray[i].x,circleArray[i].y);
            if(temp <= minDist){
                centroid_index = j;
                minDist = temp;
            }
        }
        cluster_dict[centroid_index]['elem'].push(circleArray[i])
    }
    return cluster_dict;
}

function calculateDistance(x1,y1,x2,y2){
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1-y2,2));
}

function colorEachCentroid(num_centroids){
    while(color_arr.length!=num_centroids){
        color = getRandomColor();
        if(color_arr.indexOf(color) == -1){
            color_arr.push(color);
        }
    }
}

function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}