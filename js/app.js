"use strict";

var countTime = 50;
var beginTime;
var currentTime;

/* canvas */
var ctx;
var offset = 40;

/* timeline */
var origin, canvas;
var timeline;
var scp_x = 0.4; var scp_y = 0.2;
var ecp_x = 0.5; var ecp_y = 0.8;
var timeFlag;

/* flags */
var flag = {
  grid : true,
  timeline : true
}

$(function() {
  $("body").onload = setup();
  $("canvas").onload = draw();
})

function setup() {
  var t_width = Math.floor(($(window).width()-offset*2)/500)*500;
  var t_height = Math.floor(($(window).height()-offset*2)/100)*100;
  canvas = new Vector(t_width, t_height);

  origin = new Vector(
      ($(window).width() - t_width)/2, 
      ($(window).height() - t_height)/2);
  var c = $("#canvas");
  c.attr("width", canvas.x);
  c.attr("height", canvas.y);
  c.css("margin-top", origin.y);
  c.css("margin-left", origin.x);

  var startPoint = new Vector(0,0);
  var endPoint = new Vector(canvas.x,canvas.y);
  var startCtrlPoint = new Vector(canvas.x*scp_x,canvas.y*scp_y);
  var endCtrlPoint = new Vector(canvas.x*ecp_x,canvas.y*ecp_y);
  timeline = new Timeline(canvas, startPoint, startCtrlPoint, endCtrlPoint, endPoint);

  calc();
}

function draw() {
  var cv = document.getElementById("canvas");

  /* event handlers */
  $("body").keypress(keyDown);
  $("#canvas")
    .mousedown({canvas : cv}, mouseDown)
    .mouseup(mouseUp)
    .mousemove({canvas : cv}, mouseMove);

  /* start animation */
  if (cv.getContext) {
    ctx = cv.getContext("2d");
    setInterval(loop, 50);
  }
}

function loop() {
  ctx.clearRect(0,0,canvas.x,canvas.y);

  if (flag.grid) {
    timeline.drawGrid(ctx, countTime);
  }
  if (flag.timeline) {
    timeline.drawCtrl(ctx);
    timeline.draw(ctx);
  }

  ctx.save();
  ctx.fillStyle = "rgba(100, 90, 110, 1.0)";
  for (var i=0; i<=countTime; i++) {
    ctx.beginPath();
    ctx.arc(timeFlag[i].x, timeFlag[i].y, 5, 0, 2 * Math.PI, false);
    ctx.fill();
  }
  ctx.restore();
}

function calc() {
  timeFlag = new Object();
  var x_step = canvas.y/countTime;
  for (var i=0; i<=countTime; i++) {
    timeFlag[i] = timeline.getX(x_step*i);
  }
  /*
  var h = timeline.getPoint(0.5);
  var w = timeline.getX(50);
  ctx.save();
  ctx.fillStyle = "rgba(100, 90, 110, 1.0)";
  ctx.beginPath();
  ctx.arc(h.x, h.y, 5, 0, 2 * Math.PI, false);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(w.x, w.y, 5, 0, 2 * Math.PI, false);
  ctx.fill();
  ctx.restore();
  */
}
