"use strict";

var countTime = 3.00;
var beginTime;
var currentTime;
var ctx;
var origin, canvas;
var timeline;
var scp_x = 1.0; var scp_y = 0.15;
var ecp_x = 0.8; var ecp_y = 0.9;

$(function() {
  $("body").onload = setup();
  $("canvas").onload = draw();
})

function setup() {
  origin = new Vector(40, 40);
  canvas = new Vector(500, 500);

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

  $("#canvas")
    .mousedown({canvas : cv}, mouseDown)
    .mouseup(mouseUp)
    .mousemove({canvas : cv}, mouseMove);

  if (cv.getContext) {
    ctx = cv.getContext("2d");

    setInterval(loop, 100);
  }
}

function loop() {
  ctx.clearRect(0,0,canvas.x,canvas.y);

  timeline.drawGrid(ctx);
  timeline.draw(ctx);
  timeline.drawCtrl(ctx);

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
}

function mouseDown(event) {
  timeline.mouseDown(event);
}
function mouseUp(event) {
  timeline.mouseUp(event);
  timeline.dumpCtrl();
}
function mouseMove(event) {
  timeline.mouseMove(event);
}
