define(function(require){
  var Vector = require('./vector');
  var Rect = require('./rect');
  var Collision = require('./collision');
  var PhysicsState = function(gameObject){
    this.gameObject = gameObject;
    this.gravity = false;
    this.still = true;
    this.colliders = [];
    this.velocity = Vector.zero();
  };

  PhysicsState.prototype.change = function(dt){
    if (this.gravity)
      this.velocity = this.velocity.add(new Vector(0, this.gravityForce));
    this.gameObject.frame.x += this.velocity.x * dt;
    this.gameObject.frame.y += this.velocity.y * dt;
  };

  PhysicsState.prototype.detectCollision = function(c, dt) {
    if (this.still && c.still)
      return;//two still objects cannot collide (because we presume that they both do not move)

    var alreadyCollided = (
      ~this.colliders.indexOf(c.gameObject)
      ||
      ~c.colliders.indexOf(this.gameObject)
      );

    var center1 = this.gameObject.getGlobalPosition();
    var center2 = c.gameObject.getGlobalPosition();
    var overlapArea = Rect.overlapArea(
      center1.x, center1.y, this.gameObject.frame.width, this.gameObject.frame.height,
      center2.x, center2.y, c.gameObject.frame.width, c.gameObject.frame.height
      );
    if (overlapArea)
    {
      if (!alreadyCollided)
      {
        this.addCollider(c);
        this.enterCollision(c, overlapArea, dt);
      }
      this.collision(c, overlapArea, dt);
    }
    else if (alreadyCollided)
    {
      this.removeCollider(c);
      this.exitCollision(c, dt);
    }

    if (this.gameObject.isRemoved() || c.gameObject.isRemoved())
      this.removeCollider(c);
  };

  PhysicsState.prototype.addCollider = function(collider) {
    this.colliders.push(collider.gameObject);
    collider.colliders.push(this.gameObject);
  };

  PhysicsState.prototype.removeCollider = function(collider) {
    this.colliders.splice(this.colliders.indexOf(collider.gameObject), 1);
    collider.colliders.splice(this.colliders.indexOf(this.gameObject), 1);
  };

  PhysicsState.prototype.collision = function(collider, overlapArea, dt){
    if (this.gameObject.handleCollision)
      this.gameObject.handleCollision(new Collision(collider.gameObject, overlapArea), dt);
    if (collider.gameObject.handleCollision)
      collider.gameObject.handleCollision(new Collision(this.gameObject, overlapArea.mul(-1)), dt);
  };

  PhysicsState.prototype.enterCollision = function(collider, overlapArea, dt){
    if (this.gameObject.handleEnterCollision)
      this.gameObject.handleEnterCollision(new Collision(collider.gameObject, overlapArea), dt);
    if (collider.gameObject.handleEnterCollision)
      collider.gameObject.handleEnterCollision(new Collision(this.gameObject, overlapArea.mul(-1)), dt);
  };

  PhysicsState.prototype.exitCollision = function(collider, dt){
    if (this.gameObject.handleExitCollision)
      this.gameObject.handleExitCollision(collider.gameObject, dt);
    if (collider.gameObject.handleExitCollision)
      collider.gameObject.handleExitCollision(this.gameObject, dt);
  };
  return PhysicsState;
});
