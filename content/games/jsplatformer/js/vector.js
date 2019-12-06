define(function(require){
  var Vector = function(x, y) {
    this.x = x || 0;
    this.y = y || 0;
  };

  Vector.prototype.mul = function(scalar) {
    return new Vector(this.x * scalar, this.y * scalar);
  };
  Vector.prototype.div = function(scalar) {
    return new Vector(this.x / scalar, this.y / scalar);
  };
  Vector.prototype.add = function(v) {
    return new Vector(this.x + v.x, this.y + v.y);
  };
  Vector.prototype.sub = function(v) {
    return new Vector(this.x - v.x, this.y - v.y);
  };
  Vector.prototype.copy = function() {
    return new Vector(this.x, this.y);
  };

  Vector.zero = function(){return new Vector(0, 0);}
  return Vector;
});
