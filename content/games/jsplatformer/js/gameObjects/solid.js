define(function(require){
  var GameObject = require('./gameObject');
  var PhysicsState = require('../physicsState');
  var Player = require('./player');
  var Solid = function(frame, damageVelocityThreshold, damageVelocityMultiplier){
    GameObject.call(this, frame);

    this.physics = new PhysicsState(this);
    this.damageVelocityThreshold = damageVelocityThreshold;
    this.damageVelocityMultiplier = damageVelocityMultiplier;
  };

  Solid.prototype = Object.create(GameObject.prototype);
  Solid.prototype.constructor = Solid;
  Solid.prototype.super = GameObject.prototype;

  Solid.prototype.handleEnterCollision = function(collision){
    if (collision.collider instanceof Player && collision.collider.physics.velocity.y > this.damageVelocityThreshold)
      collision.collider.dealDamage(Math.round(collision.collider.physics.velocity.y * this.damageVelocityMultiplier));
  };

  Solid.prototype.handleCollision = function(collision){
    if (Math.abs(collision.collisionVector.x) < Math.abs(collision.collisionVector.y))
    {
      collision.collider.frame.x += collision.collisionVector.x;
      collision.collider.physics.velocity.x = 0;
    }
    else
    {
      collision.collider.frame.y += collision.collisionVector.y;
      collision.collider.physics.velocity.y = 0;
    }
  };
  return Solid;
});
