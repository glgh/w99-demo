const TRACK_CANVAS_WIDTH = 400; //px
const TRACK_CANVAS_HEIGHT = 400; //px
const TRACK_RADIUS = 42; //m - use 58
const TRACK_WIDTH = 3.7; //m
const TRACK_COLOR = "#D3D3D3";
const TRACK_DISPLAY_FACTOR = 4; //3.28; //m -> px

function drawTrack() {
  var context = document.getElementById("track").getContext("2d");
  context.save(); //save the canvas state
  context.beginPath();
  context.arc(TRACK_CANVAS_WIDTH/2, TRACK_CANVAS_HEIGHT/2, TRACK_RADIUS * TRACK_DISPLAY_FACTOR, 0, 2*Math.PI);
  context.lineWidth = TRACK_WIDTH * TRACK_DISPLAY_FACTOR;
  context.strokeStyle = TRACK_COLOR;
  context.stroke();
  context.closePath();
  context.restore(); //restore canvas state
}

function drawCar(car) {
  var context = document.getElementById("track").getContext("2d");
  context.save() //save the canvas state
  context.beginPath();
  context.translate(TRACK_CANVAS_WIDTH/2, TRACK_CANVAS_HEIGHT/2); // move rotation point to center
  context.rotate(car.x/TRACK_RADIUS); //calculate angle in radius
  context.rect(TRACK_RADIUS * TRACK_DISPLAY_FACTOR - car.width/2 * TRACK_DISPLAY_FACTOR, -car.length/2 * TRACK_DISPLAY_FACTOR, car.width * TRACK_DISPLAY_FACTOR, car.length * TRACK_DISPLAY_FACTOR);
  context.fillStyle = car.color;
  context.closePath();
  context.fill();
  context.restore(); //restore canvas state
}
