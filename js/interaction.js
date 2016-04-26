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
  if (event.which === 13) {
    /* RETURN key */
    event.preventDefault();
  } else if (event.which >= 65 && event.which <= 122) {
    /* if alphabet */
    var key = String.fromCharCode(event.which);
    if (key === 'g') {
      flag.grid = !flag.grid;
    } else if (key === 'b') {
      flag.timeline = !flag.timeline;
    }
    console.log(key);
  } else {
    switch(event.which) {
      /* 63 : ? */
      case 63:
        dispHelp();
        break;
      /* 43 : + */
      case 43:
        break;
      /* 45 : - */
      case 45:
        break;
      default:
        console.log("undefined key : " + event.which);

    }
  }
}

function dispHelp() {
  $("#help").toggle();
}
