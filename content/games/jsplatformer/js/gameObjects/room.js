define(function(require){
  var GameObject = require('./gameObject');
  var Solid = require('./solid');
  var Rect = require('../rect');
  var Room = function(frame, width, damageVelocityThreshold, damageVelocityMultiplier){
    GameObject.call(this, frame);

    this.width = width;
    this.ceiling = new Solid(new Rect(
        0,
        -this.frame.height / 2 + this.width / 2,
        this.frame.width,
        this.width), damageVelocityThreshold, damageVelocityMultiplier);
    this.addChild(this.ceiling);
    this.wallLeft = new Solid(new Rect(
        -this.frame.width / 2 + this.width / 2,
        0,
        this.width,
        this.frame.height - this.width * 2), damageVelocityThreshold, damageVelocityMultiplier);
    this.addChild(this.wallLeft);
    this.wallRight = new Solid(new Rect(
        this.frame.width / 2 - this.width / 2,
        0,
        this.width,
        this.frame.height - this.width * 2), damageVelocityThreshold, damageVelocityMultiplier);
    this.addChild(this.wallRight);
    this.floor = new Solid(new Rect(
        0,
        this.frame.height / 2 - this.width / 2,
        this.frame.width,
        this.width), damageVelocityThreshold, damageVelocityMultiplier);
    this.addChild(this.floor);
  };

  Room.prototype = Object.create(GameObject.prototype);
  Room.prototype.constructor = Room;
  Room.prototype.super = GameObject.prototype;
  return Room;
});
