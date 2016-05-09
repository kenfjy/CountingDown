function Timeline(c, c1, c2, c3, c4) {
  this.width = c.x; this.height = c.y;

  this.startCtrlPressed = false;
  this.endCtrlPressed = false;

  this.bezier = new Bezier(
      new Vector(c1.x, this.height - c1.y),
      new Vector(c2.x, this.height - c2.y),
      new Vector(c3.x, this.height - c3.y),
      new Vector(c4.x, this.height - c4.y)
      );

  this.draw = function(ctx){
    ctx.save();
    ctx.strokeStyle = "rgba(200, 90, 110, 1.0)";
    ctx.lineWidth = 3.0;
    this.bezier.draw(ctx);
    ctx.restore();
  }

  this.drawGrid = function(ctx, res) {
    var gridNum = res;
    if (gridNum >= 100) {
      gridNum = 100;
    }
    ctx.strokeStyle = "rgba(200, 1.0)";
    ctx.lineWidth = 0.3;
    var widthStep = this.width/gridNum;
    var heightStep = this.height/gridNum;
    for (i=0; i<gridNum; i++) {
      ctx.beginPath();
      ctx.moveTo(widthStep*i, 0);
      ctx.lineTo(widthStep*i, this.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, heightStep*i);
      ctx.lineTo(this.width, heightStep*i);
      ctx.stroke();
    }
  }

  this.drawGridX = function(ctx, res) {
    var gridNum = res;
    if (gridNum >= 50) {
      gridNum = 50;
    }
    ctx.strokeStyle = "rgba(200, 1.0)";
    ctx.lineWidth = 0.3;
    var heightStep = this.height/gridNum;
    for (i=0; i<gridNum; i++) {
      ctx.beginPath();
      ctx.moveTo(0, heightStep*i);
      ctx.lineTo(this.width, heightStep*i);
      ctx.stroke();
    }
  }

  this.drawCurrent = function(ctx, tp) {
    ctx.save();
    ctx.strokeStyle = "rgba(100, 200, 110, 1.0)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(tp.x, 0);
    ctx.lineTo(tp.x, this.height);
    ctx.stroke();
    ctx.restore();

    ctx.save();
    ctx.fillStyle = "rgba(100, 200, 110, 1.0)";
    ctx.beginPath();
    ctx.arc(tp.x, tp.y, 5, 0, 2 * Math.PI, false);
    ctx.fill();
    ctx.restore();
  }

  this.drawBackground = function(ctx, tp) {
    ctx.save();
    ctx.fillStyle = "rgba(80, 90, 200, 0.5)";
    ctx.beginPath();
    ctx.rect(0, tp.y, canvas.x, canvas.y);
    ctx.fill();
    ctx.restore();
  }

  this.drawCtrl = function(ctx) {
    ctx.save();
    ctx.strokeStyle = "rgba(200, 90, 110, 1.0)";
    ctx.lineWidth = 2.5;
    this.bezier.drawCtrlLn(ctx);
    ctx.restore();

    ctx.save();
    ctx.fillStyle = "rgba(200, 90, 110, 1.0)";
    this.bezier.drawCtrlPt(ctx, 6);
    ctx.restore();
  }

  this.dumpCtrl = function() {
    var params = 
      "scp_x = " + this.bezier.startCtrlPoint.x / this.width + ", "
      + "scp_y = " + (this.height - this.bezier.startCtrlPoint.y) / this.height + ", "
      + "ecp_x = " + this.bezier.endCtrlPoint.x / this.width + ", "
      + "ecp_y = " + (this.height - this.bezier.endCtrlPoint.y) / this.height + ";";
    console.log(
      "var " + params
    );
    return params;
  }

  this.setParams = function(c_s, c_e) {
    this.bezier.startCtrlPoint.x = c_s.x;
    this.bezier.startCtrlPoint.y = this.height - c_s.y;
    this.bezier.endCtrlPoint.x = c_e.x;
    this.bezier.endCtrlPoint.y = this.height - c_e.y;
  }

  /*
   * Event listeners
   */
  this.mouseUp = function(event) {
    this.startCtrlPressed = false;
    this.endCtrlPressed = false;
  }

  this.mouseDown = function(event) {
    var mouse = getMouse(event);
    var distStart = mouse.dist(this.bezier.startCtrlPoint);
    var distEnd = mouse.dist(this.bezier.endCtrlPoint);
    if (distStart <= mouseThreshold || distEnd <= mouseThreshold) {
      if (distStart < distEnd) {
        this.startCtrlPressed = true;
      } else {
        this.endCtrlPressed = true;
      }
    }
  }

  this.mouseMove = function(event) {
    if (this.startCtrlPressed || this.endCtrlPressed) {
      var mouse = getMouse(event);
      if (this.startCtrlPressed) {
        this.bezier.startCtrlPoint = mouse;
      } else {
        this.bezier.endCtrlPoint = mouse;
      }
    }
  }

} // timeline
