"use strict";

var countTime = 10;
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
      timeline.drawGridX(ctx, countTime);
      ctx.save();
      for (var i=0; i<=countTime; i++) {
        /* grid lines */
        if (i != 0 && i != countTime) {
          ctx.beginPath();
          ctx.moveTo(timeFlag[i]/1000/countTime*canvas.x, 0);
          ctx.lineTo(timeFlag[i]/1000/countTime*canvas.x, canvas.y);
          ctx.stroke();
        }
      }
      ctx.restore();
    }
    if (flag.points) {
      ctx.save();
      ctx.fillStyle = "rgba(100, 90, 110, 0.5)";
      for (var i=0; i<=countTime; i++) {
        /* time points */
        ctx.beginPath();
        ctx.arc(timePoint[i].x, timePoint[i].y, 5, 0, 2 * Math.PI, false);
        ctx.fill();
      }
      ctx.restore();
    }

    timeline.drawCtrl(ctx);
    timeline.draw(ctx);
  }

  if (flag.play) {
    var timeNow = new Date().getTime();
    var ellapsedTime = countTime*1000 - (endTime - timeNow);
    if (timeFlag[currentTime+1] <= ellapsedTime) {
      console.log(timeFlag[currentTime+1].x + " | " + ellapsedTime);
      currentTime++;
      if (currentTime == countTime) {
        console.log("stop");
        flag.play = false;
        currentTime = 0;
      }
    }

    timeline.drawCurrent(ctx, ellapsedTime/1000/countTime)
  } else {
    if (currentTime > 0) {
      timeline.drawCurrent(ctx, timeFlag[currentTime]/1000/countTime)
    }
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
  var y_step = canvas.y/countTime;

  timePoint = new Object();
  for (var i=0; i<=countTime; i++) {
    timePoint[i] = timeline.bezier.getX(canvas.y - y_step*i, canvas.y);
  }
  
  timeFlag = new Array();
  for (var i=0; i<=countTime; i++) {
    timeFlag[i] = timePoint[i].x * (countTime * 1000) / canvas.x;
  }
}
