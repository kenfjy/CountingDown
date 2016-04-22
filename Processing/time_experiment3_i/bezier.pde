float threshold = 0.0001;
color lineColor = color(200, 90, 110);
color ctrlColor = color(200, 90, 110);

/* enhanced lib from philho */
class BezierCurve
{
  PVector startPoint, endPoint;
  PVector startCtrlPoint, endCtrlPoint;
  Boolean startCtrlPrs = false;
  Boolean endCtrlPrs = false;

  /* 
   * Initialization of the curve
   */
  BezierCurve(PVector t_startPoint, PVector t_startCtrlPoint, PVector t_endCtrlPoint, PVector t_endPoint)
  {
    startPoint = t_startPoint;
    endPoint = t_endPoint;
    startCtrlPoint = t_startCtrlPoint;
    endCtrlPoint = t_endCtrlPoint;
  }

  /*
   * Gets a point on the Bézier curve, given a relative "distance" from the starting point,
   * expressed as a float number between 0 (start point) and 1 (end point).
   */
  PVector getPoint(float pos)
  {
    float x = bezierPoint(startPoint.x, startCtrlPoint.x, 
      endCtrlPoint.x, endPoint.x, 
      pos);
    float y = bezierPoint(startPoint.y, startCtrlPoint.y, 
      endCtrlPoint.y, endPoint.y, 
      pos);
    return new PVector(x, y);
  }

  /*
   * get absolute position
   */
  float getXPos(float ypos) {
    //    startPoint / endPoint
    float rel_ypos = abs((ypos - startPoint.y) / (endPoint.y - startPoint.y));
    if (rel_ypos == 0 || rel_ypos == 1) {
      PVector tpos = this.getPoint(rel_ypos);
      return tpos.x;
    } else {

      float[] range = {0, rel_ypos, 1};

      PVector tpos = this.getPoint(range[1]); 
      while (abs(tpos.y - ypos) > threshold) {
        if (tpos.y < ypos) {
          range[2] = range[1];
          range[1] = (range[1] + range[0]) / 2;
        } else {
          range[0] = range[1];
          range[1] = (range[1] + range[2]) / 2;
        }
        tpos = this.getPoint(range[1]);
      }

      return tpos.x;
    }
  }  

  float getYPos(float xpos) {
    //    startPoint / endPoint
    float rel_xpos = abs((xpos - startPoint.x) / (endPoint.x - startPoint.x));
    if (rel_xpos == 0 || rel_xpos == 1) {
      PVector tpos = this.getPoint(rel_xpos);
      return tpos.y;
    } else {
      float[] range = {0, rel_xpos, 1};

      PVector tpos = this.getPoint(range[1]); 
      while (abs(tpos.x - xpos) > threshold) {
        if (tpos.x > xpos) {
          range[2] = range[1];
          range[1] = (range[1] + range[0]) / 2;
        } else {
          range[0] = range[1];
          range[1] = (range[1] + range[2]) / 2;
        }
        tpos = this.getPoint(range[1]);
      }

      return tpos.y;
    }
  }

  void draw()
  {
    pushStyle();
    noFill();
    stroke(lineColor);
    strokeWeight(3.0);

    bezier(startPoint.x, startPoint.y, 
      startCtrlPoint.x, startCtrlPoint.y, 
      endCtrlPoint.x, endCtrlPoint.y, 
      endPoint.x, endPoint.y);

    popStyle();
  }
  
  //void drawGrid() {
  //  pushStyle();
  //  noFill();
  //  popStyle();
  //}

  void drawCtrls() {
    pushStyle();
    noFill();
    stroke(ctrlColor, 150);
    strokeWeight(2.5);

    line(this.startPoint.x, this.startPoint.y, 
      this.startCtrlPoint.x, this.startCtrlPoint.y);
    line(this.endPoint.x, this.endPoint.y, 
      this.endCtrlPoint.x, this.endCtrlPoint.y);
    popStyle();

    pushStyle();
    fill(ctrlColor);
    noStroke();

    int rad = 10, radSelect = 16;
    ellipse(this.startPoint.x, this.startPoint.y, rad, rad);
    ellipse(this.startCtrlPoint.x, this.startCtrlPoint.y, rad, rad);
    ellipse(this.endPoint.x, this.endPoint.y, rad, rad);
    ellipse(this.endCtrlPoint.x, this.endCtrlPoint.y, rad, rad);

    if (this.startCtrlPrs == true) { 
      ellipse(this.startCtrlPoint.x, this.startCtrlPoint.y, radSelect, radSelect);
    } 
    if (this.endCtrlPrs == true) {
      ellipse(this.endCtrlPoint.x, this.endCtrlPoint.y, radSelect, radSelect);
    }

    popStyle();
  }

  void drawDetailsNb(int pointNb)
  {
    pushStyle();
    if (pointNb <= 1) pointNb = 2;
    stroke(#FF0000);
    strokeWeight(1);

    for (int i = 0; i < pointNb; i++)
    {
      float pos = (float) i / (pointNb - 1);

      PVector pt = getPoint(pos);
      ellipse(pt.x, pt.y, 3, 3);
    }
    popStyle();
  }

  void drawDetailsDist(float dist)
  {
    pushStyle();
    stroke(#FFFF00);
    strokeWeight(1);

    // Use an arbitrary number of points, it is hard to estimate
    // the length of a curve
    int pointNb = 1000;
    float totalDist = 0;
    PVector prevPt = startPoint;
    ellipse(prevPt.x, prevPt.y, 7, 7);
    for (int i = 1; i < pointNb; i++)
    {
      float pos = (float) i / (pointNb - 1);

      PVector pt = getPoint(pos);
      totalDist += dist(pt.x, pt.y, prevPt.x, prevPt.y);
      if (totalDist >= dist)
      {
        ellipse(pt.x, pt.y, 7, 7);
        totalDist = 0;
      }
      prevPt = pt;
    }
    popStyle();
  }

  void mouseReleased() {
    this.startCtrlPrs = false;
    this.endCtrlPrs = false;
  }

  void mousePressed() {
    float mouseThreshold = 10;
    PVector mouse = new PVector(mouseX, mouseY);
    float distStart = mouse.dist(this.startCtrlPoint);
    float distEnd = mouse.dist(this.endCtrlPoint);
    if (distStart < mouseThreshold || distEnd < mouseThreshold) {
      if (distStart < distEnd) {
        this.startCtrlPrs = true;
        this.endCtrlPrs = false;
      } else {
        this.startCtrlPrs = false;
        this.endCtrlPrs = true;
      }
    }
  }

  void mouseDragged() {
    if (this.startCtrlPrs == true || this.endCtrlPrs == true) {
      PVector mouse = new PVector(mouseX, mouseY);
      if (this.startCtrlPrs == true) {
        this.startCtrlPoint = mouse;
      } else {
        this.endCtrlPoint = mouse;
      }
    }
  }

  void dumpResult() {
    PVector t_startCtrlPoint = new PVector(startCtrlPoint.x - startPoint.x, startCtrlPoint.y - endPoint.y);
    PVector t_endCtrlPoint = new PVector(endCtrlPoint.x - origin.x, endCtrlPoint.y - origin.y);    

    print("float c1_x = " + t_startCtrlPoint.x / canvas.x + ", ");
    print("c1_y = " + t_startCtrlPoint.y / canvas.y + ", ");
    print("c2_x = " + t_endCtrlPoint.x / canvas.x + ", ");
    println("c2_y = " + t_endCtrlPoint.y / canvas.y + ";");
  }
}