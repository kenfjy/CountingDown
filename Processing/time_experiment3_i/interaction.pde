
void mousePressed() {
  bc.mousePressed();
}

void mouseDragged() {
  bc.mouseDragged();
}

void mouseReleased() {
  bc.mouseReleased();
  bc.dumpResult();
  calc();
}

void keyPressed () {
  if (key != CODED) {
    if (key == ' ') {
      if (!play) {
        startMillis = millis();
        tempSecs = 0;
      } else {
        float elapsedMillis = millis() - startMillis;
        println(elapsedMillis/1000);
      }
      play = !play;
    } else if (key == 's') {
      display = !display;
    } else if (key == 'i') {
      invert = !invert;
    } else if (key == 'r') {
      reverse = !reverse;
    }
  }
}