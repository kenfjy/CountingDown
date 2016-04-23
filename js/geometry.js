var calcThreshold = 0.0001;
var mouseThreshold = 30;
var gridNum = 10;

/* 
 * VECTOR
 */
var Vector = function (t_x, t_y) {
  this.x = t_x;
  this.y = t_y;
};
Vector.prototype.dist = function(other) {
  return Math.sqrt(Math.pow(this.x-other.x,2) + Math.pow(this.y-other.y,2));
}
Vector.prototype.dump = function() {
  console.log("x: " + this.x + ", y: " + this.y);
};

/* 
 * BEZIER
 */
var Bezier = function(c, c1, c2, c3, c4) {
  this.width = c.x; this.height = c.y;
  this.startPoint = this.invert(c1);
  this.startCtrlPoint = this.invert(c2);
  this.endCtrlPoint = this.invert(c3);
  this.endPoint = this.invert(c4);

  this.startCtrlPressed = false;
  this.endCtrlPressed = false;
}

Bezier.prototype.invert = function(vec) {
  var inv = new Vector(vec.x, this.height - vec.y);
  return inv;
}

Bezier.prototype.draw = function(ctx) {
  ctx.save();
  ctx.strokeStyle = "rgba(200, 90, 110, 1.0)";
  ctx.lineWidth = 3.0;
  ctx.beginPath();
  ctx.moveTo(this.startPoint.x, this.startPoint.y);
  ctx.bezierCurveTo(
      this.startCtrlPoint.x, this.startCtrlPoint.y, 
      this.endCtrlPoint.x, this.endCtrlPoint.y, 
      this.endPoint.x, this.endPoint.y);
  ctx.stroke();
  ctx.restore();
}

Bezier.prototype.drawGrid = function(ctx) {
  ctx.strokeStyle = "rgba(200, 1.0)";
  ctx.lineWidth = 0.3;
  for (i=1; i<gridNum; i++) {
    ctx.beginPath();
    ctx.moveTo(this.width*i/gridNum, 0);
    ctx.lineTo(this.width*i/gridNum, this.height);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, this.height*i/gridNum);
    ctx.lineTo(this.width, this.height*i/gridNum);
    ctx.stroke();
  }
}

Bezier.prototype.drawCtrl = function(ctx) {
  ctx.save();
  var radius = 6;
  ctx.strokeStyle = "rgba(200, 90, 110, 1.0)";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(this.startPoint.x, this.startPoint.y);
  ctx.lineTo(this.startCtrlPoint.x, this.startCtrlPoint.y);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(this.endPoint.x, this.endPoint.y);
  ctx.lineTo(this.endCtrlPoint.x, this.endCtrlPoint.y);
  ctx.stroke();

  ctx.fillStyle = "rgba(200, 90, 110, 1.0)";
  ctx.beginPath();
  ctx.arc(this.startCtrlPoint.x, this.startCtrlPoint.y, radius, 0, 2 * Math.PI, false);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(this.endCtrlPoint.x, this.endCtrlPoint.y, radius, 0, 2 * Math.PI, false);
  ctx.fill();
  ctx.restore();
}

Bezier.prototype.getX = function(ypos) {
  rel_y = ypos / canvas.y;
  if (rel_y == 0 || rel_y == 1) {
    if (rel_y == 0) {
      return this.startPoint;
    } else {
      return this.endPoint;
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

Bezier.prototype.getPoint = function(t) {
  if (t != 0.00000 && t != 1.00000) {
    var tp = 1.00000 - t;
    var t_x = t*t*t*this.endPoint.x + 3*t*t*tp*this.endCtrlPoint.x + 3*t*tp*tp*this.startCtrlPoint.x + tp*tp*tp*this.startPoint.x;
    var t_y = t*t*t*this.endPoint.y + 3*t*t*tp*this.endCtrlPoint.y + 3*t*tp*tp*this.startCtrlPoint.y + tp*tp*tp*this.startPoint.y;
    var t_v = new Vector(t_x, t_y);
    return t_v;
  } else {
    if (t == 0) { 
      return this.startPoint;
    } else {
      return this.endPoint;
    }
  }
}

Bezier.prototype.dump = function() {
  console.log(this.startPoint.x);
}

/*
 * Event listeners
 */
Bezier.prototype.mouseUp = function(event) {
  this.startCtrlPressed = false;
  this.endCtrlPressed = false;
}

Bezier.prototype.mouseDown = function(event) {
  var rect = event.data.canvas.getBoundingClientRect();
  var mouse = new Vector(
      event.clientX - rect.left,
      event.clientY - rect.top
      );
  var distStart = mouse.dist(this.startCtrlPoint);
  var distEnd = mouse.dist(this.endCtrlPoint);
  console.log(distStart);
  console.log(distEnd);
  if (distStart <= mouseThreshold || distEnd <= mouseThreshold) {
    if (distStart < distEnd) {
      this.startCtrlPressed = true;
      console.log("start selected");
    } else {
      this.endCtrlPressed = true;
    }
  }
}

Bezier.prototype.mouseMove = function(event) {
  if (this.startCtrlPressed || this.endCtrlPressed) {
    var rect = event.data.canvas.getBoundingClientRect();
    var mouse = new Vector(
      event.clientX - rect.left,
      event.clientY - rect.top
    );
    if (this.startCtrlPressed) {
      this.startCtrlPoint = mouse;
      return true;
    } else {
      this.endCtrlPoint = mouse;
      return true;
    }
  }
  return false;
}
