define(function(require){
  var GameObject = require('./gameObject');
  var PhysicsState = require('../physicsState');
  var Consumable = function(frame, speedBoost, jumpSpeedBoost){
    GameObject.call(this, frame);

    this.physics = new PhysicsState(this);

    this.speedBoost = speedBoost;
    this.jumpSpeedBoost = jumpSpeedBoost;
  };

  Consumable.prototype = Object.create(GameObject.prototype);
  Consumable.prototype.constructor = Consumable;
  Consumable.prototype.super = GameObject.prototype;
  return Consumable;
});
