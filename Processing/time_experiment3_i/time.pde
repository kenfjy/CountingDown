void displayTime(int secs, boolean reverse, int duration) {
  String min, sec;
  if (!reverse) {
    min = nf((secs/60), 2);
    sec = nf(secs%60, 2);
  } else {
    secs = duration - secs;
    min = nf((secs/60), 2);
    sec = nf(secs%60, 2);
  }
  pushStyle();
  if (invert && tempSecs%2 == 1) {
    fill(bright);
  } else {
    fill(dark);
  }
  text(min+":"+sec, width/2, height/2);
  popStyle();
}