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
} // vector

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

  this.getY = function(xpos, width) {
    var rel_x = xpos / width;
    if (rel_x <= 0 || rel_x >= 1) {
      if (rel_x <= 0) {
        return this.startPoint;
      } else {
        return this.endPoint;
      }
    } else {
      var range = [0, rel_x, 1];

      var tpos = this.getPoint(range[1]); 
      while (Math.abs(tpos.x - xpos) > calcThreshold) {
        if (tpos.x > xpos) {
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
} // bezier


function getMouse(event) {
  var rect = event.data.canvas.getBoundingClientRect();
  return new Vector(
      event.clientX - rect.left,
      event.clientY - rect.top
      );
}

