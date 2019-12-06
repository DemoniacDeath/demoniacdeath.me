define(function(require){
  var GameObject = require('./gameObject');
  var PhysicsState = require('../physicsState');
  var Vector = require('../vector');
  var Consumable = require('./consumable');
  var Player = function(frame){
    GameObject.call(this, frame);

    this.speed = 0;
    this.jumpSpeed = 0;
    this.power = 0;
    this.maxPower = 0;
    this.jumped = false;
    this.health = 100;
    this.dead = false;
    this.won = false;
    this.originalSize = this.frame.getSize();
    this.physics = new PhysicsState(this);
    this.physics.gravity = true;
    this.physics.still = false;
    this.idleAnimation = null;
    this.jumpAnimation = null;
    this.moveAnimation = null;
    this.moveAnimationLeft = null;
    this.moveAnimationRight = null;
    this.crouchAnimation = null;
    this.crouchAnimationLeft = null;
    this.crouchAnimationRight = null;
    this.crouchMoveAnimation = null;
    this.crouchMoveAnimationLeft = null;
    this.crouchMoveAnimationRight = null;
    this.winText = null;
    this.deathText = null;
    this.healthBar = null;
    this.powerBar = null;

    var _crouched = false;

    this.isCrouched = function(){return _crouched;};
    this.setCrouched = function(crouched){
      if (crouched && !_crouched)
      {
        _crouched = true;
        this.frame.y += this.originalSize.height / 4;
        this.frame.height = this.originalSize.height / 2;
      }
      else if (!crouched && _crouched)
      {
        _crouched = false;
        this.frame.y -= this.originalSize.height / 4;
        this.frame.height = this.originalSize.height;
      }
    };
  };

  Player.prototype = Object.create(GameObject.prototype);
  Player.prototype.constructor = Player;
  Player.prototype.super = GameObject.prototype;

  Player.prototype.keyDown = function(key){
    switch (key) {
      case 'KeyG':
        this.physics.gravity = !this.physics.gravity;
        if (!this.physics.gravity)
        {
          this.jumped = true;
          this.physics.velocity = Vector.zero();
        }
        break;
    }
    GameObject.prototype.keyDown.call(this, key);
  };

  Player.prototype.handleKeyboardState = function(keys, dt) {
    if (!this.dead)
    {
      var sitDown = false;
      var moveLeft = false;
      var moveRight = false;
      var moveVector = new Vector();
      var speed = this.speed * dt;
      var jumpSpeed = this.jumpSpeed;
      if (keys['ArrowLeft'] || keys['KeyA'])
      {
        moveVector = moveVector.add(new Vector(-speed, 0));
        moveLeft = true;
      }
      if (keys['ArrowRight'] || keys['KeyD'])
      {
        moveVector = moveVector.add(new Vector(speed, 0));
        moveRight = true;
      }
      if (keys['ArrowUp'] || keys['KeyW'] || keys['Space'])
      {
        if (!this.physics.gravity)
        {
          moveVector = moveVector.add(new Vector(0, -speed));
        }
        else
        {
          if (!this.jumped)
          {
            this.physics.velocity = this.physics.velocity.add(new Vector(0, -jumpSpeed));
            this.jumped = true;
          }
        }
      }
      if (keys['ArrowDown'] || keys['KeyS'] || keys['ControlLeft'])
      {
        if (!this.physics.gravity)
          moveVector = moveVector.add(new Vector(0, speed));
        else
          sitDown = true;
      }
      this.setCrouched(sitDown);

      if (moveLeft && !moveRight)
      {
        this.moveAnimation = this.moveAnimationLeft;
        this.crouchAnimation = this.crouchAnimationLeft;
        this.crouchMoveAnimation = this.crouchMoveAnimationLeft;
      }
      if (moveRight && !moveLeft)
      {
        this.moveAnimation = this.moveAnimationRight;
        this.crouchAnimation = this.crouchAnimationRight;
        this.crouchMoveAnimation = this.crouchMoveAnimationRight;
      }

      if (!moveLeft && !moveRight && !this.jumped && !this.isCrouched())
        this.animation = this.idleAnimation;
      if (!moveLeft && !moveRight && !this.jumped && this.isCrouched())
        this.animation = this.crouchAnimation;
      if ((moveLeft || moveRight) && !this.jumped && !this.isCrouched())
          this.animation = this.moveAnimation;
      if ((moveLeft || moveRight) && !this.jumped && this.isCrouched())
          this.animation = this.crouchMoveAnimation;
      if (this.jumped && this.isCrouched())
          this.animation = this.crouchAnimation;
      if (this.jumped && !this.isCrouched())
          this.animation = this.jumpAnimation;

      this.frame.setCenter(this.frame.getCenter().add(moveVector));
    }
    GameObject.prototype.handleKeyboardState.call(this, keys, dt);
  };

  Player.prototype.handleEnterCollision = function(collision){
    if (collision.collider instanceof Consumable)
    {
      this.power += 1;
      this.powerBar.setValue(this.power/this.maxPower*100);
      collision.collider.remove();
      this.speed += collision.collider.speedBoost;
      this.jumpSpeed += collision.collider.jumpSpeedBoost;
      if (this.power >= this.maxPower)
        this.win();
    }
  };

  Player.prototype.handleExitCollision = function(collider){
    if (!this.physics.colliders.length)
    {
      this.jumped = true;
    }
  };

  Player.prototype.handleCollision = function(collision){
    if (Math.abs(collision.collisionVector.x) > Math.abs(collision.collisionVector.y))
      if (collision.collisionVector.y > 0 && this.jumped && this.physics.gravity)
        this.jumped = false;
  };

  Player.prototype.dealDamage = function(damage){
    if (!this.won)
    {
      this.health -= damage;
      this.healthBar.setValue(this.health);
      if (this.health < 0)
        this.die();
    }
  };

  Player.prototype.die = function(){
    this.dead = true;
    this.deathText.visible = true;
  };

  Player.prototype.win = function(){
    this.won = true;
    this.winText.visible = true;
  };
  return Player;
});
