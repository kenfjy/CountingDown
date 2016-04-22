"use strict";

var origin, canvas;

$(function() {
  origin = new Vector(40, 40);
  canvas = new Vector(400, 400);

  $("body").onload = setup(canvas);
  $("canvas").onload = draw();
})

function setup() {
  var c = $("canvas");
  c.attr("width", canvas.x);
  c.attr("height", canvas.y);
  canvas.dump();
}

function draw() {
  var canvas = document.getElementById("canvas");
  if (canvas.getContext) {
    var ctx = canvas.getContext("2d");

    ctx.fillStyle = "rgb(200,0,0)";
    ctx.fillRect (10, 10, 55, 50);

    ctx.fillStyle = "rgba(0, 0, 200, 0.5)";
    ctx.fillRect (30, 30, 55, 50);

    var curve = new Bezier(100,25 , 10,90 , 110,100 , 150,195); 
    ctx.drawSkeleton(curve); 
    ctx.drawCurve(curve); 
  }
}

