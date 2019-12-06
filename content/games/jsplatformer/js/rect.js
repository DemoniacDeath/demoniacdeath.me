define(function(require){
  var Size = require('./size');
  var Vector = require('./vector');
  var Rect = function(x, y, w, h) {
    this.x = x || 0;
    this.y = y || 0;
    this.width = w || 0;
    this.height = h || 0;
  };

  Rect.prototype.getCenter = function(){
    return new Vector(this.x, this.y);
  };
  Rect.prototype.setCenter = function(center){
    this.x = center.x;
    this.y = center.y;
  };

  Rect.prototype.getSize = function(){
    return new Size(this.width, this.height);
  };
  Rect.prototype.setSize = function(size){
    this.width = size.width;
    this.height = size.height;
  };

  Rect.prototype.overlapArea = function(rect) {
    return Rect.overlapArea(this.x, this.y, this.width, this.height, rect.x, rect.y, rect.width, rect.height);
  };

  Rect.prototype.copy = function(){
    return new Rect(this.x, this.y, this.width, this.height);
  };

  Rect.overlapArea = function(firstX, firstY, firstW, firstH, secondX, secondY, secondW, secondH){
    var x1 = firstX - firstW / 2;
    var x2 = secondX - secondW / 2;
    var X1 = x1 + firstW;
    var X2 = x2 + secondW;
    var y1 = firstY - firstH / 2;
    var y2 = secondY - secondH / 2;
    var Y1 = y1 + firstH;
    var Y2 = y2 + secondH;

    var diffX1 = X1 - x2;
    var diffX2 = x1 - X2;
    var diffY1 = Y1 - y2;
    var diffY2 = y1 - Y2;

    if (diffX1 > 0 &&
      diffX2 < 0 &&
      diffY1 > 0 &&
      diffY2 < 0)
    {
      return new Vector(
        (Math.abs(diffX1) < Math.abs(diffX2) ? diffX1 : diffX2),
        (Math.abs(diffY1) < Math.abs(diffY2) ? diffY1 : diffY2)
        );
    }
    return false;
  };
  return Rect;
});
