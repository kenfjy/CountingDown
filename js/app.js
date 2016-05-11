"use strict";

var countTime = 600;
var scp_x = 0.178, scp_y = 0.424, ecp_x = 0.516, ecp_y = 0.85;

var endTime = 0;
var currentTime = 0;

/* canvas */
var ctx;
var offset = 25;

/* timeline */
var origin, canvas;
var timeline;
var timeFlag, timePoint;

/* flags */
var flag = {
  play : false,
  reverse : true,
  timeline : true,
  grid : false,
  points : false,
  canvas : true,
  help : false,
  counter : false,
  sound : true
}

/* audio */
var audioContext, gainNode;
var ticBuffer = null, alarmBuffer = null;
var sounds = {
  tic : {
    src : 'https://kenfjy.github.io/CountingDown/asset/ticking_cut.ogg'
  },
  alarm : {
    src : 'https://kenfjy.github.io/CountingDown/asset/alarm_cut.ogg'
  }
};
/* 
 * Music Credits
 * TIC : http://www.soundjay.com/clock/clock-ticking-2.mp3
 * ALARM : http://www.soundjay.com/clock/alarm-clock-01.mp3
 */


$(function() {
  $("body").onload = setup();
  $("canvas").onload = draw();
})

function setup() {
  var t_width = Math.floor(($(window).width()-offset*2)/100)*100;
  var t_height = Math.floor(($(window).height()-offset*2)/100)*100;
  canvas = new Vector(t_width, t_height);

  origin = new Vector(
      ($(window).width() - t_width)/2, 
      ($(window).height() - t_height)/2);
  var c = $("#canvas");
  c.attr("width", canvas.x);
  c.attr("height", canvas.y);
  c.css("margin-top", ($(window).height()-canvas.y)/2);
  if (canvas.x <= 500) {
    $("#counter p").css("font-size", "7.0rem");
  }

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

  /* init audiocontext */
  try {
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    audioContext = new AudioContext();
    gainNode = audioContext.createGain();
    loadSounds(sounds);
    gainNode.connect(audioContext.destination);
  } catch(e) {
    flag.sound = false;
    alert('Web Audio API is not supported in this browser');
  }
}

function draw() {
  var cv = document.getElementById("canvas");

  /* event handlers */
  // $("body").keypress(keyDown);
  $("body").keydown(keyDown);
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
  /* Time calculation */
  var tp = false;

  if (flag.play) {
    var timeNow = new Date().getTime();
    var ellapsedTime = countTime*1000 - (endTime - timeNow);
    var t_currentTime = currentTime;
    while (timeFlag[t_currentTime+1] <= ellapsedTime) {
      t_currentTime++;
      if (t_currentTime == countTime) {
        console.log("stop");
        flag.play = false;
        if (flag.sound) {
          playSound(sounds.alarm.buffer);
        }
        currentTime = 0;
        break;
      }
    }
    if (t_currentTime != currentTime && t_currentTime != countTime) {
      currentTime = t_currentTime;
      if (flag.sound) {
        playSound(sounds.tic.buffer);
      }
    }

    tp = timeline.bezier.getY(timeline.width*ellapsedTime/1000/countTime, timeline.width);
  } else {
    if (currentTime > 0) {
      tp = timeline.bezier.getY(timeline.width*timeFlag[currentTime]/1000/countTime, timeline.width);
    }
  }

  /* Display time */
  if (!flag.reverse) {
    setTime(currentTime);
  } else {
    setTime(countTime - currentTime);
  }

  /* Start canvas */
  ctx.clearRect(0,0,canvas.x,canvas.y);


  /* Draw background */
  if (flag.canvas && tp != false) {
    timeline.drawBackground(ctx, tp);
  }

  if (flag.canvas) {
    if (flag.grid) {
      timeline.drawGridX(ctx, countTime);
      ctx.save();
      var countUp = 1;
      if (countTime >= 100) {
        countUp = 10;
      }
      for (var i=0; i<=countTime; i+=countUp) {
        /* grid lines */
        if (i != 0 && i != countTime) {
          ctx.beginPath();
          ctx.moveTo(timeFlag[i]/1000/countTime*timeline.width, 0);
          ctx.lineTo(timeFlag[i]/1000/countTime*timeline.width, timeline.height);
          ctx.stroke();
        }
      }
      ctx.restore();
    }

    if (flag.timeline) {
      timeline.drawCtrl(ctx);
      timeline.draw(ctx);
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

    if (flag.timeline) {
      timeline.drawCurrent(ctx, tp)
    }
  }

}

function setTime(time) {
  var min = "0" + Math.floor(time/60);
  var sec = "0" + time%60;
  $("#counter_min").text(min.slice(-2));
  $("#counter_sec").text(sec.slice(-2));
}

function calc() {
  var y_step = timeline.height/countTime;

  timePoint = new Object();
  for (var i=0; i<=countTime; i++) {
    timePoint[i] = timeline.bezier.getX(timeline.height - y_step*i, timeline.height);
  }

  timeFlag = new Array();
  for (var i=0; i<=countTime; i++) {
    timeFlag[i] = timePoint[i].x * (countTime * 1000) / timeline.width;
  }
}

function playSound(buffer) {
  var src = audioContext.createBufferSource();
  src.buffer = buffer;
  src.connect(audioContext.destination);
  src.start(0);
}

function loadSoundObj(obj) {
  var request = new XMLHttpRequest();
  request.open('GET', obj.src, true);
  request.responseType = 'arraybuffer';

  request.onload = function() {
    audioContext.decodeAudioData(request.response, function(buffer) {
      obj.buffer = buffer;
    }, function(err) {
      throw new Error(err);
      console.log(err);
    });
  }

  request.send();
}

function loadSounds(obj) {
  var len = obj.length, i;

  for (i in obj) {
    if (obj.hasOwnProperty(i)) {
      loadSoundObj(obj[i]);
    }
  }
}

function randomParams() {
  var c_s = new Vector(canvas.x, canvas.y);
  var c_e = new Vector(canvas.x, canvas.y);
  c_s.random(0, canvas.x*0.2, 0, canvas.y*0.2)
    c_e.random(canvas.x*0.8, canvas.x, canvas.y*0.8, canvas.y)
    console.log(c_s);
  console.log(c_e);
  timeline.setParams(c_s, c_e);
  calc();
}
