define(function(require){
  var GameObject = require('../gameObject');
  var UIElement = function(frame){
    GameObject.call(this, frame);
  };

  UIElement.prototype = Object.create(GameObject.prototype);
  UIElement.prototype.constructor = UIElement;
  UIElement.prototype.super = UIElement.prototype;
  return UIElement;
});
