const METER_TO_FT = 3.28084;
const MPS_TO_MPH = 2.23694;

const STATUS_CANVAS_WIDTH = 350;
const STATUS_CANVAS_HEIGHT = 150;

const STATUS_LEFT_PADDING = 50;
const STATUS_RIGHT_PADDING = 100;
const STATUS_TOP_PADDING = 5;
const STATUS_BOTTOM_PADDING = 30;

const STATUS_PLOT_WIDTH = STATUS_CANVAS_WIDTH - STATUS_LEFT_PADDING - STATUS_RIGHT_PADDING;
const STATUS_PLOT_HEIGHT = STATUS_CANVAS_HEIGHT - STATUS_TOP_PADDING - STATUS_BOTTOM_PADDING;

const DX_MIN = 0;
const DX_MAX = 100;
const DV_MIN = -15;
const DV_MAX = 15;

const STATUS_AREA_A_COLOR = 'lightcoral';
const STATUS_AREA_B_COLOR = 'lightyellow';
const STATUS_AREA_F_COLOR = 'silver';
const STATUS_AREA_W_COLOR = '#d3f8d3';

const STATUS_LINE_X_STEP = 5;
const STATUS_LINE_N_SPLINE = 9;
const STATUS_LINE_DASH_STYLE = [3,5];
const STATUS_LINE_COLOR = 'darkslategray';

//const STATUS_AXIS_STYLE = 'Black';
const STATUS_TICK_STYLE = 'Black';
const STATUS_TICK_ALPHA = 0.2;
// const STATUS_DX_TICK_UNIT = 50/METER_TO_FT; //50ft
// const STATUS_DV_TICK_UNIT = 10/MPS_TO_MPH; //5mph
const STATUS_DX_TICK_UNIT = 20; //20m
const STATUS_DV_TICK_UNIT = 5; //5m/s

const STATUS_POINTER_RADIUS = 4;
// const STATUS_POINTER_A_COLOR = 'darkred';
// const STATUS_POINTER_B_COLOR = 'orange';
// const STATUS_POINTER_F_COLOR = 'grey'; //'Green';
// const STATUS_POINTER_W_COLOR = 'Green'; //'Grey';
const STATUS_POINTER_OUTSIDE_STYLE = 'Black';
const STATUS_POINTER_COLOR = {
  'A': 'darkred',
  'B': 'orange',
  'f': 'grey',
  'w': 'Green'
}

const STATUS_EMPTY_COLOR = '#e6e6e6';

Number.prototype.m2ft = function() {
    return this.valueOf() * METER_TO_FT;
};

Number.prototype.mps2mph = function() {
    return this.valueOf() * MPS_TO_MPH;
};

Number.prototype.dx2x = function() {
  return Math.round((this.valueOf() - DX_MIN)/(DX_MAX - DX_MIN)*STATUS_PLOT_WIDTH);
};

Number.prototype.dv2y = function() {
  return Math.round(STATUS_PLOT_HEIGHT - (this.valueOf()-DV_MIN)/(DV_MAX - DV_MIN)*STATUS_PLOT_HEIGHT);
};

function plotCarStatus(canvas, car, index, parameters) {
  var dx = car.status.dx;
  var sdxc = car.status.sdxc;
  var sdxo = car.status.sdxo;
  var dv = car.status.dv;

  var f_sdvc = function(dx) {return (parameters.cc4 - parameters.cc6/10000*dx*dx)};
  var f_sdvo = function(dx) {return (parameters.cc6/10000*dx*dx + parameters.cc5)};
  var f_sdxv = function(dv) {return (sdxo + parameters.cc3*(dv-parameters.cc4))};

  //Begin Plot
  var context = canvas.getContext("2d");
  context.clearRect(0, 0, STATUS_CANVAS_WIDTH, STATUS_CANVAS_HEIGHT);

  //Car Label
  context.beginPath();
  context.rect(0,0,15,15);
  context.fillStyle = car.color;
  context.fill();
  context.closePath();
  context.font = "12px Arial";
  context.textAlign = "start";
  context.textBaseline = "alphabetic";
  context.fillText(index.toFixed(0), 19, 12);

  context.translate(STATUS_LEFT_PADDING, STATUS_TOP_PADDING);

  //1. Area W
  context.beginPath();
  context.rect(0, 0, STATUS_PLOT_WIDTH, STATUS_PLOT_HEIGHT);
  context.fillStyle = STATUS_AREA_W_COLOR;
  context.fill();
  context.closePath();

  //2. Area f
  var f_top_left_dv = f_sdvo(sdxc);
  var f_top_right_dv = f_sdvo(sdxo);
  var f_bottom_left_dv = f_sdvc(sdxc);
  var f_bottom_right_dv = f_sdvc(sdxo);
  context.beginPath();
  context.moveTo(sdxc.dx2x(), f_top_left_dv.dv2y());
  context.lineTo(sdxo.dx2x(), f_top_right_dv.dv2y());
  context.lineTo(sdxo.dx2x(), f_bottom_right_dv.dv2y());
  context.lineTo(sdxc.dx2x(), f_bottom_left_dv.dv2y());
  context.fillStyle = STATUS_AREA_F_COLOR;
  context.fill();
  context.closePath();

  //3. Area A
  var a_top_dv = f_top_left_dv;
  context.beginPath();
  context.moveTo(0, a_top_dv.dv2y());
  context.lineTo(0, DV_MIN.dv2y());
  context.lineTo(sdxc.dx2x(), DV_MIN.dv2y());
  context.lineTo(sdxc.dx2x(), a_top_dv.dv2y());
  context.fillStyle = STATUS_AREA_A_COLOR;
  context.fill();
  context.closePath();

  // 4. Area B
  var b_top_left_dv = f_bottom_left_dv;
  var b_top_right_dv = f_bottom_right_dv;
  var b_bottom_right_dx = f_sdxv(DV_MIN);
  context.beginPath();
  context.moveTo(sdxc.dx2x(), b_top_left_dv.dv2y());
  context.lineTo(sdxc.dx2x(), DV_MIN.dv2y());
  if (b_bottom_right_dx <= DX_MAX){
    context.lineTo(b_bottom_right_dx.dx2x(), DV_MIN.dv2y());
  } else { //if x > xmax, cut it off by the right side of canvas
    context.lineTo(DX_MAX.dx2x(), DV_MIN.dv2y());
    context.lineTo(DX_MAX.dx2x(), f_sdvc(DX_MAX).dv2y());
  }
  context.lineTo(sdxo.dx2x(), b_top_right_dv.dv2y());
  context.fillStyle = STATUS_AREA_B_COLOR;
  context.fill();
  context.closePath();

  // 5. sdvo & sdvc line
  context.setLineDash(STATUS_LINE_DASH_STYLE);
  context.strokeStyle = STATUS_LINE_COLOR;
  //sdvo
  context.beginPath();
  context.moveTo(sdxc.dx2x(), f_top_left_dv.dv2y());
  context.lineTo(sdxo.dx2x(), f_top_right_dv.dv2y());
  for (var i = 1; i < STATUS_LINE_N_SPLINE + 1; i++) {
    var dx_next = sdxo + i*STATUS_LINE_X_STEP;
    if (dx_next < DX_MAX) {
      var dv_next = f_sdvo(dx_next);
      context.lineTo(dx_next.dx2x(), dv_next.dv2y());
    }
  }
  context.stroke();
  context.closePath();
  //sdvc
  context.beginPath();
  context.moveTo(sdxc.dx2x(), f_bottom_left_dv.dv2y());
  context.lineTo(sdxo.dx2x(), f_bottom_right_dv.dv2y());
  for (var i = 1; i < STATUS_LINE_N_SPLINE + 1; i++) {
    var dx_next = sdxo + i*STATUS_LINE_X_STEP;
    if (dx_next < DX_MAX) {
      var dv_next = f_sdvc(dx_next);
      context.lineTo(dx_next.dx2x(), dv_next.dv2y());
    }
  }
  context.stroke();
  context.closePath();
  //reset
  context.setLineDash([0,0]);

  // 6. Axis
  context.fillStyle = 'Black';

  //dv
  context.font = '12px Arial';
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText('dv', -30, STATUS_PLOT_HEIGHT/2 - 6);
  context.fillText('(m/s)', -30, STATUS_PLOT_HEIGHT/2 + 6);

  //dv tick
  context.font = '10px Arial';
  context.textAlign = "end";
  context.textBaseline = "middle";
  var dv_tick = STATUS_DV_TICK_UNIT * Math.ceil(DV_MIN / STATUS_DV_TICK_UNIT);
  while (dv_tick <= DV_MAX) {
    context.beginPath();
    context.moveTo(0, dv_tick.dv2y());
    context.lineTo(STATUS_PLOT_WIDTH, dv_tick.dv2y());
    context.globalAlpha = STATUS_TICK_ALPHA;
    context.strokeStyle = STATUS_TICK_STYLE;
    context.stroke();
    context.globalAlpha = 1;
    context.closePath();
    //var dv_label = dv_tick.mps2mph().toFixed(0).toString();
    var dv_label = dv_tick.toFixed(0).toString();
    var dv_label_x = -4;
    var dv_label_y = dv_tick.dv2y();
    context.fillText(dv_label, dv_label_x, dv_label_y);
    dv_tick += STATUS_DV_TICK_UNIT
}

  //dx
  context.font = '12px Arial';
  context.textAlign = "center";
  context.textBaseline = "alphabetic";
  context.fillText('dx (m)', STATUS_PLOT_WIDTH/2, STATUS_PLOT_HEIGHT + 25);

  //dx tick
  context.font = '10px Arial';
  context.textAlign = "center";
  context.textBaseline = "alphabetic";
  var dx_tick = 0;
  while (dx_tick <= DX_MAX) {
    context.beginPath();
    context.moveTo(dx_tick.dx2x(), 0);
    context.lineTo(dx_tick.dx2x(), STATUS_PLOT_HEIGHT);
    context.globalAlpha = STATUS_TICK_ALPHA;
    context.strokeStyle = STATUS_TICK_STYLE;
    context.stroke();
    context.globalAlpha = 1;
    context.closePath();
    //var dx_label = dx_tick.m2ft().toFixed(0).toString();
    var dx_label = dx_tick.toFixed(0).toString();
    var dx_label_x = dx_tick.dx2x();
    var dx_label_y = STATUS_PLOT_HEIGHT + 12;
    context.fillText(dx_label, dx_label_x, dx_label_y);
    dx_tick += STATUS_DX_TICK_UNIT;
  }

  // 7. Plot Status Pointer
  context.beginPath();
  var pointer_x = dx.dx2x();
  var pointer_y = dv.dv2y();

  var status_code = car.status.code;

  //Check if it's outside of the plot area. If so, draw it on border
  if (pointer_x > STATUS_PLOT_WIDTH) {
    pointer_x = STATUS_PLOT_WIDTH;
    status_code = 'Outside';
  }
  if (pointer_y > STATUS_PLOT_HEIGHT) {
    pointer_y = STATUS_PLOT_HEIGHT;
    status_code = 'Outside';
  } else if (pointer_y < 0) {
    pointer_y = 0;
    status_code = 'Outside';
  }

  context.arc(pointer_x, pointer_y, STATUS_POINTER_RADIUS, 0, 2*Math.PI);
  if (status_code === 'Outside') { //Draw a hollow pointer
    context.strokeStyle = STATUS_POINTER_OUTSIDE_STYLE;
    context.stroke();
  } else { //Draw a solid Pointer
    context.fillStyle = STATUS_POINTER_COLOR[car.status.code];
    context.fill();
  }
  context.closePath();

  // 8. Plot Status text
  context.font = '10px Arial';
  context.textAlign = "start";
  context.textBaseline = "top";
  context.fillStyle = 'Black'
  var message_y0 = -4;
  var message_y_increment = 10;
  var message_x = STATUS_PLOT_WIDTH + 6;
  var message = ['x: ' + car.x.toFixed(1),
                 'v: ' + car.v.toFixed(1),
                 'a: ' + car.a.toFixed(1),
                 'dx: ' + car.status.dx.toFixed(1),
                 'dv: ' + car.status.dv.toFixed(1),
                 'sdxc: ' + car.status.sdxc.toFixed(1),
                 'sdxv: ' + car.status.sdxv.toFixed(1),
                 'sdxo: ' + car.status.sdxo.toFixed(1),
                 'sdvc: ' + car.status.sdvc.toFixed(1),
                 'sdvo: ' + car.status.sdvo.toFixed(1)];
  for (var i = 0; i < message.length; i++) {
    context.fillText(message[i], message_x, message_y0 + message_y_increment*i);
  }
  context.font = 'bold 10px Arial';
  context.fillStyle = STATUS_POINTER_COLOR[car.status.code];
  context.fillText(car.status.message_condition, message_x, message_y0 + message_y_increment*i + 1);
  context.fillText(car.status.message_action, message_x, message_y0 + message_y_increment*(i+1) + 1);
  //context.fillText(car.status.description, message_x, message_y0 + message_y_increment*12);

  context.translate(-STATUS_LEFT_PADDING, -STATUS_TOP_PADDING);
}

function plotCarStatusEmpty(canvas, car, index) {
  var context = canvas.getContext("2d");
  context.clearRect(0, 0, STATUS_CANVAS_WIDTH, STATUS_CANVAS_HEIGHT);

  //Background
  context.beginPath();
  context.rect(STATUS_LEFT_PADDING, STATUS_TOP_PADDING, STATUS_PLOT_WIDTH, STATUS_PLOT_HEIGHT);
  context.fillStyle = STATUS_EMPTY_COLOR;
  context.fill();
  context.closePath();

  //Car Info
  context.fillStyle = car.color;
  context.font = "20px Arial";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText("Car #" + index.toFixed(0) + " is ready", STATUS_LEFT_PADDING + STATUS_PLOT_WIDTH/2, STATUS_TOP_PADDING + STATUS_PLOT_HEIGHT/2);

}
