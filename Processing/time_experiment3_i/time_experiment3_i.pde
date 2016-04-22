static float durationMins = 1.0;

int startMillis = 0;
int tempSecs = 0;
static int durationSecs = int(durationMins * 60);
boolean play = false;
boolean reverse = false;
boolean display = true;
boolean invert = true;
color bright = color(180);
color dark = color(80);

BezierCurve bc;

PVector origin, canvas;
PVector margin = new PVector(0, 0);

PVector[] points;
PVector[] points2;
float[] frames;
//float c1_x = 0.0, c1_y = 1.0, c2_x = 1.0, c2_y = 0.0;
//float c1_x = 0.0953125, c1_y = 0.5234375, c2_x = 0.446875, c2_y = 0.06875;
float c1_x = 0.349, c1_y = 0.7765625, c2_x = 0.771, c2_y = 0.3328125;
PFont font;

void setup() {
  fullScreen();
  //size(1000, 680);
  rectMode(CORNER);

  font = loadFont("DINOT-Bold-200.vlw");
  textFont(font, 200);
  textAlign(CENTER, CENTER);

  origin = new PVector(margin.x, margin.y);
  canvas = new PVector(width-margin.x*2, height-margin.y*2);

  bc = new BezierCurve(
    new PVector(origin.x, canvas.y+origin.y), // Start point: bottom left
    new PVector(origin.x+canvas.x*c1_x, origin.y+canvas.y*c1_y), // Start Ctrl point: top left
    new PVector(origin.x+canvas.x*c2_x, origin.y+canvas.y*c2_y), // End Ctrl point: top left
    new PVector(origin.x+canvas.x, origin.y) // End point: bottom right
    );

  points = new PVector[durationSecs];
  frames = new float[durationSecs];
  //points2 = new PVector[durationSecs];

  calc();
}


void draw() {
  if (invert && tempSecs%2 == 1) {
    background(dark);
  } else {
    background(bright);
  }

  if (display) {
    pushStyle();
    noStroke();
    fill(255, 255, 255, 200);
    rect(origin.x, 
      origin.y, 
      canvas.x, 
      canvas.y);  
    fill(ctrlColor, 100);
    rect(origin.x, 
      origin.y + canvas.y, 
      canvas.x, 
      -canvas.y * tempSecs / durationSecs);
    popStyle();

    bc.draw();
    bc.drawCtrls();

    //pushStyle();
    //stroke(100, 255, 255);
    //for (int i=0; i<durationSecs; i++) {
    //  line(points[i].x-15, points[i].y, points[i].x+15, points[i].y);
    //}
    //popStyle();
  }

  if (play) {
    float elapsedMillis = millis() - startMillis;
    if (elapsedMillis >= frames[tempSecs]) {
      tempSecs++;
      if (tempSecs == durationSecs) {
        play = false;
      }
    }
  }

  displayTime(tempSecs, reverse, durationSecs);
}

void calc() {
  println("Calculating");
  for (int i=0; i<durationSecs; i++) {
    float py = canvas.y*i/durationSecs+origin.y;
    points[i] = new PVector(bc.getXPos(py), py);
    frames[i] = (canvas.x - (points[i].x - origin.x)) * durationSecs * 1000 / canvas.x;
    //float px = canvas.x*i/pointNum+origin.x;
    //points2[i] = new PVector(px, bc.getYPos(px));
  }
}