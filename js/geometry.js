var calcThreshold = 0.00005;
var mouseThreshold = 30;

/* 
 * VECTOR
 */
function Vector(t_x, t_y){
  this.x = t_x;
  this.y = t_y;

  this.dist = function(other) {
    return Math.sqrt(Math.pow(this.x-other.x,2) + Math.pow(this.y-other.y,2));
  }
  this.dump = function() {
    console.log({
      x : this.x,
      y : this.y
    });
  };
}

/* 
 * BEZIER
 */

function Bezier(c1, c2, c3, c4) {
  this.startPoint = c1;
  this.startCtrlPoint = c2;
  this.endCtrlPoint = c3;
  this.endPoint = c4;

  this.draw = function(ctx) {
    ctx.beginPath();
    ctx.moveTo(this.startPoint.x, this.startPoint.y);
    ctx.bezierCurveTo(
        this.startCtrlPoint.x, this.startCtrlPoint.y, 
        this.endCtrlPoint.x, this.endCtrlPoint.y, 
        this.endPoint.x, this.endPoint.y);
    ctx.stroke();
  }

  this.drawCtrlLn = function(ctx) {
    ctx.beginPath();
    ctx.moveTo(this.startPoint.x, this.startPoint.y);
    ctx.lineTo(this.startCtrlPoint.x, this.startCtrlPoint.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(this.endPoint.x, this.endPoint.y);
    ctx.lineTo(this.endCtrlPoint.x, this.endCtrlPoint.y);
    ctx.stroke();
  }

  this.drawCtrlPt = function(ctx, radius) {
    ctx.beginPath();
    ctx.arc(this.startCtrlPoint.x, this.startCtrlPoint.y, radius, 0, 2 * Math.PI, false);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(this.endCtrlPoint.x, this.endCtrlPoint.y, radius, 0, 2 * Math.PI, false);
    ctx.fill();
  }

  this.getX = function(ypos, height) {
    var rel_y = ypos / height;
    if (rel_y <= 0 || rel_y >= 1) {
      if (rel_y <= 0) {
        return this.endPoint;
      } else {
        return this.startPoint;
      }
    } else {
      var range = [0, rel_y, 1];

      var tpos = this.getPoint(range[1]); 
      while (Math.abs(tpos.y - ypos) > calcThreshold) {
        if (tpos.y < ypos) {
          range[2] = range[1];
          range[1] = (range[1] + range[0]) / 2;
        } else {
          range[0] = range[1];
          range[1] = (range[1] + range[2]) / 2;
        }
        tpos = this.getPoint(range[1]);
      }
      return tpos;
    }
  }

  this.getPoint = function(t) {
    if (t != 0.00000 && t != 1.00000) {
      var tp = 1.00000 - t;
      var t_x = t*t*t*this.endPoint.x + 3*t*t*tp*this.endCtrlPoint.x + 3*t*tp*tp*this.startCtrlPoint.x + tp*tp*tp*this.startPoint.x;
      var t_y = t*t*t*this.endPoint.y + 3*t*t*tp*this.endCtrlPoint.y + 3*t*tp*tp*this.startCtrlPoint.y + tp*tp*tp*this.startPoint.y;
      var t_v = new Vector(t_x, t_y);
      return t_v;
    } else {
      if (t === 0.00000) { 
        return this.startPoint;
      } else {
        return this.endPoint;
      }
    }
  }
}

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

  this.drawPt = function(ctx, ypos) {
    ctx.save();
    ctx.fillStyle = "rgba(100, 90, 110, 1.0)";
    var pt = this.getX(ypos);
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, 5, 0, 2 * Math.PI, false);
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

  this.getX = function(ypos) {
    return this.bezier.getX(this.height-ypos, this.height);
  }

  this.getPoint = function(t) {
    return this.bezier.getPoint(t);
  }

  this.dumpCtrl = function() {
    console.log({
      scp_x : this.bezier.startCtrlPoint.x / this.width,
      scp_y : this.bezier.startCtrlPoint.y / this.height,
      ecp_x : this.bezier.endCtrlPoint.x / this.width,
      ecp_y : this.bezier.endCtrlPoint.y / this.height
    });
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

}

function getMouse(event) {
  var rect = event.data.canvas.getBoundingClientRect();
  return new Vector(
      event.clientX - rect.left,
      event.clientY - rect.top
      );
}

