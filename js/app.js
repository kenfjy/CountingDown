"use strict";

var countTime = 30;
var endTime = 0;
var currentTime = 0;

/* canvas */
var ctx;
var offset = 40;

/* timeline */
var origin, canvas;
var timeline;
var scp_x = 0.4; var scp_y = 0.2;
var ecp_x = 0.5; var ecp_y = 0.8;
var timeFlag, timePoint;

/* flags */
var flag = {
  play : false,
  reverse : true,
  grid : true,
  points : true,
  canvas : true,
  help : false,
  counter : true
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

  /* init views accordingly to flags */
  dispTime();
  dispHelp();
  dispCanvas();
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
  if (flag.canvas) {
    ctx.clearRect(0,0,canvas.x,canvas.y);
    if (flag.grid) {
      timeline.drawGrid(ctx, countTime);
    }
    if (flag.points) {
      ctx.save();
      ctx.fillStyle = "rgba(100, 90, 110, 0.5)";
      for (var i=0; i<=countTime; i++) {
        ctx.beginPath();
        ctx.arc(timePoint[i].x, timePoint[i].y, 5, 0, 2 * Math.PI, false);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(timeFlag[i]/1000*canvas.x/countTime, 10, 5, 0, 2 * Math.PI, false);
        ctx.fill();
        timeline.drawPt(ctx, timeFlag[i]/1000/countTime);

      }
      ctx.restore();
    }
    timeline.drawCtrl(ctx);
    timeline.draw(ctx);
    //timeline.drawPt(ctx, canvas.y*currentTime/countTime);
  }

  if (flag.play) {
    var timeNow = new Date().getTime();
    var ellapsedTime = countTime * 1000 - (endTime - timeNow);
    timeline.drawPt(ctx, ellapsedTime/1000/countTime);

    if (timeFlag[currentTime+1] <= ellapsedTime) {
      currentTime++;
      if (currentTime == countTime) {
        console.log("stop");
        flag.play = false;
      }
    }
  } else {
    timeline.drawPt(ctx, timeFlag[currentTime]/1000/countTime);
    //console.log(timeFlag[currentTime]);
  }


  if (!flag.reverse) {
    setTime(currentTime);
  } else {
    setTime(countTime - currentTime);
  }

}

function setTime(time) {
  var min = "0" + Math.floor(time/60);
  var sec = "0" + time%60;
  $("#counter_min").text(min.slice(-2));
  $("#counter_sec").text(sec.slice(-2));
}

function calc() {
  timeFlag = new Array();
  var y_step = canvas.y/countTime;
  for (var i=0; i<=countTime; i++) {
    timeFlag[i] = countTime * 1000 * timeline.getX(y_step*i).x / timeline.width;
  }

  timePoint = new Object();
  for (var i=0; i<=countTime; i++) {
    timePoint[i] = timeline.getX(y_step*i);
  }
  
}
