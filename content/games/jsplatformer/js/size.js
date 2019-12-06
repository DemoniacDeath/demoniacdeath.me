define(function(require){
  var Size = function(width, height) {
    this.width = width || 0;
    this.height = height || 0;
  };

  Size.prototype.mul = function(scalar) {
    return new Size(this.width * scalar, this.height * scalar);
  };
  Size.prototype.div = function(scalar) {
    return new Size(this.width / scalar, this.height / scalar);
  };
  Size.prototype.add = function(v) {
    return new Size(this.width + v.width, this.height + v.height);
  };
  Size.prototype.sub = function(v) {
    return new Size(this.width - v.width, this.height - v.height);
  };
  Size.prototype.copy = function() {
    return new Size(this.width, this.height);
  };
  return Size;
});
