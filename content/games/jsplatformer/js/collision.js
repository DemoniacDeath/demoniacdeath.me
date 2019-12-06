define(function(require){
  var Collision = function(collider, collisionVector){
    this.collider = collider;
    this.collisionVector = collisionVector;
  };
  return Collision;
});
