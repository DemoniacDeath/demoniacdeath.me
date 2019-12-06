define(function(require){
  var UIElement = require('./ui.element');
  var UIBar = function(frame){
    UIElement.call(this, frame);

    var _value = 100;
    var _originalFrame = frame.copy();

    this.getValue = function(){
      return _value;
    };
    this.setValue = function(value){
      if (value > 100) value = 100;
      if (value < 0) value = 0;
      _value = value;

      this.frame.x = _originalFrame.x + _originalFrame.width * ((value - 100) / 200);
      this.frame.width = _originalFrame.width / 100 * value;
    };
    this.resetOriginalFrame = function(frame){
      _originalFrame = frame;
    };
  };

  UIBar.prototype = Object.create(UIElement.prototype);
  UIBar.prototype.constructor = UIBar;
  UIBar.prototype.super = UIElement.prototype;

  UIBar.prototype.render = function(renderer, localBasis, cameraPosition, cameraSize){
    UIElement.prototype.render.call(this, renderer, localBasis, cameraPosition, cameraSize, true);
  };
  return UIBar;
});
