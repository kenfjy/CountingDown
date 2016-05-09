function mouseDown(event) {
  timeline.mouseDown(event);
}
function mouseUp(event) {
  timeline.mouseUp(event);
  timeline.dumpCtrl();
  calc();
}
function mouseMove(event) {
  timeline.mouseMove(event);
}

function keyDown(event) {
  console.log(event);
  if (event.which === 13) {
    /* RETURN key */
    event.preventDefault();
  } else if (event.which >= 65 && event.which <= 90) {
    /* if alphabet */
    var key = String.fromCharCode(event.which); 
    if (event.shiftKey == false) {
      key = key.toLowerCase();
    }
    console.log("key : " + key);
    if (key === 'g') {
      flag.grid = !flag.grid;
    } else if (key === 'd') {
      flag.canvas = !flag.canvas;
      dispCanvas();
    } else if (key === 'h') {
      flag.help = !flag.help;
      dispHelp();
    } else if (key === 't') {
      flag.counter = !flag.counter;
      dispTime();

    } else if (key === 'T') {
      flag.timeline = !flag.timeline;
    } else if (key === 'c') {
      flag.play = false;
      currentTime = 0;
      endTime = 0;
    } else if (key === 'r') {
      flag.reverse = !flag.reverse;
    } else if (key === 's') {
      flag.sound = !flag.sound;
      if (flag.sound) {
        try {
          window.AudioContext = window.AudioContext || window.webkitAudioContext;
        } catch(e) {
          flag.sound = false;
          alert('Web Audio API is not supported in this browser');
        }
      }
    } else if (key === 'p') {
      flag.points = !flag.points;
    }
  } else {
    switch(event.keyCode) {
      case 38: // UP
        gainNode.gain.value += 1;
        console.log("louder : " + gainNode.gain.value);
        break;
      case 40: // DOWN
        gainNode.gain.value -= 1;
        console.log("quieter : " + gainNode.gain.value);
        break;
      case 37: // LEFT
        if (!flag.play) {
          if (countTime > 10) {
            countTime -= 10;
            calc();
          }
        }
        break;
      case 39: // RIGHT
        if (!flag.play) {
          countTime += 10;
          calc();
        }
        break;
      case 32: // [SPACE]
        flag.play = !flag.play;
        if (flag.play) {
          if (currentTime == 0) {
            endTime = new Date().getTime()+countTime*1000
          } else {
            var remainingTime = countTime*1000 - timeFlag[currentTime];
            endTime = new Date().getTime()+remainingTime;
          }
        } else {
          var timeNow = new Date().getTime();
          var ellapsedTime = countTime * 1000 - (endTime - timeNow);
        }
        break;
      default:
        console.log("undefined key : " + event.which);

    }
  }
}

function dispTime() {
  setVisible($("#counter"), flag.counter);
}

function dispHelp() {
  setVisible($("#help"), flag.help);
}

function dispCanvas() {
  setVisible($("#canvas"), flag.canvas);
}
function setVisible(elem, flag) {
  if (!flag) {
    elem.css("visibility", "hidden");
  } else {
    elem.css("visibility", "visible");
  }
}
