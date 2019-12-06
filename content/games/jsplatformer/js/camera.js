define(function(require){
  var GameObject = require('./gameObject');
  var Size = require('../size');
  var Camera = function(frame){
    GameObject.call(this, frame);

    this.originalSize = new Size(frame.width, frame.height);
  };

  Camera.prototype = Object.create(GameObject.prototype);
  Camera.prototype.constructor = Camera;
  Camera.prototype.super = GameObject.prototype;

  Camera.prototype.setSize = function(size){
    this.originalSize = size;
    this.frame.setSize(size);
  };

  Camera.prototype.handleKeyboardState = function(keys) {
    if (keys['KeyZ'])
    {
      this.frame.setSize(this.originalSize.mul(2));
    }
    else
    {
      this.frame.setSize(this.originalSize);
    }
  };
  return Camera;
});
