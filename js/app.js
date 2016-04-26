"use strict";

var countTime = 3.00;
var beginTime;
var currentTime;

/* canvas */
var ctx;

/* timeline */
var origin, canvas;
var timeline;
var scp_x = 1.0; var scp_y = 0.15;
var ecp_x = 0.8; var ecp_y = 0.9;

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
  origin = new Vector(40, 40);
  canvas = new Vector($("body").width()-80, $("body").height()-80);

  var c = $("#canvas");
  c.attr("width", canvas.x);
  c.attr("height", canvas.y);

  var startPoint = new Vector(0,0);
  var endPoint = new Vector(canvas.x,canvas.y);
  var startCtrlPoint = new Vector(canvas.x*scp_x,canvas.y*scp_y);
  var endCtrlPoint = new Vector(canvas.x*ecp_x,canvas.y*ecp_y);
  timeline = new Bezier(canvas, startPoint, startCtrlPoint, endCtrlPoint, endPoint);

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
    timeline.drawGrid(ctx);
  }
  if (flag.timeline) {
    timeline.drawCtrl(ctx);
    timeline.draw(ctx);
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

