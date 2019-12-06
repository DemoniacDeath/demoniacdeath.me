define(function(require){
  var Vector = require('../vector');
  var GameObject = function(frame){
    this.frame = frame;
    this.parent = null;
    this.children = [];
    this.renderObject = null;
    this.physics = null;
    this.animation = null;
    this.visible = true;
    this._removed = false;
  };

  GameObject.prototype.isRemoved = function(){
    return this._removed;
  };

  GameObject.prototype.remove = function(){
    this._removed = true;
    this.parent.removeChild(this);
  };

  GameObject.prototype.addChild = function(child){
    this.children.push(child);
    child.parent = this;
  };

  GameObject.prototype.removeChild = function(child){
    ~(index = this.children.indexOf(child)) | this.children.splice(index, 1);
  };

  GameObject.prototype.getGlobalPosition = function(){
    if (!this.parent)
      return this.frame.getCenter();
    else
      return this.frame.getCenter().add(this.parent.getGlobalPosition());
  };

  GameObject.prototype.render = function(renderer, localBasis, cameraPosition, cameraSize, noScaleCaching){
    if (this.visible && this.renderObject)
      this.renderObject.render(renderer, new Vector(this.frame.x + localBasis.x, this.frame.y + localBasis.y), this.frame.getSize(), cameraPosition, cameraSize, noScaleCaching);
    var i = 0;
    var len = this.children.length;
    while (i < len)
      this.children[i++].render(renderer, localBasis.add(this.frame.getCenter()), cameraPosition, cameraSize);
  };

  GameObject.prototype.keyDown = function(key){
    var i = 0;
    var len = this.children.length;
    while (i < len)
      this.children[i++].keyDown(key);
  };

  GameObject.prototype.handleKeyboardState = function(keys, dt){
    var i = 0;
    var len = this.children.length;
    while (i < len)
      this.children[i++].handleKeyboardState(keys, dt);
  };

  GameObject.prototype.processPhysics = function(dt){
    if (this.physics)
      this.physics.change(dt);
    var i = 0;
    var len = this.children.length;
    while (i < len)
      this.children[i++].processPhysics(dt);
  };

  GameObject.prototype.detectCollisions = function(dt){
    var allColliders = [];
    this._collectColliders(allColliders);
    for (var i = 0; i < allColliders.length; i++)
      for (var j = i + 1; j < allColliders.length; j++)
        allColliders[i].physics.detectCollision(allColliders[j].physics, dt);
  };

  GameObject.prototype._collectColliders = function(allColliders){
    if (this.physics)
      allColliders.push(this);
    var i = 0;
    var len = this.children.length;
    while (i < len)
      this.children[i++]._collectColliders(allColliders);
  };

  GameObject.prototype.animate = function(ticks){
    if (this.animation)
      this.renderObject = this.animation.animate(ticks);
    var i = 0;
    var len = this.children.length;
    while (i < len)
      this.children[i++].animate(ticks);
  };

  return GameObject;
});
