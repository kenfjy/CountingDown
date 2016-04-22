var Vector = function (t_x, t_y) {
  this.x = t_x;
  this.y = t_y;
};

Vector.prototype.dump = function() {
  console.log("x: " + this.x + ", y: " + this.y);
};


