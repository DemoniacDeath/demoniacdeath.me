define(function(require){
  var Color = require('./color');
  var Size = require('./size');
  var Vector = require('./vector');
  var Rect = require('./rect');
  var Renderer = require('./renderer');
  var RenderObject = require('./renderObject');
  var Animation = require('./animation');
  var PhysicsState = require('./physicsState');
  var GameObject = require('./gameObjects/gameObject');
  var Camera = require('./gameObjects/camera');
  var Player = require('./gameObjects/player');
  var Solid = require('./gameObjects/solid');
  var Room = require('./gameObjects/room');
  var Consumable = require('./gameObjects/consumable');
  var UIElement = require('./gameObjects/ui/ui.element');
  var UIBar = require('./gameObjects/ui/ui.bar');
  var UIText = require('./gameObjects/ui/ui.text');
  return function(gameCanvas, uiCanvas, resources){
    const gridSquareSize = 40;
    //TODO: fix physics. with low value of gridSquareSize the collisions are not detected
    const gravityForce = 0.6 * gridSquareSize;
    const itemChance = 0.16;
    const worldWidth = 40;
    const worldHeight = 30;
    const damageVelocityThreshold = 45000 / gridSquareSize;
    const damageVelocityMultiplier = 1.6 / gridSquareSize;
    const speed = 7.8 * gridSquareSize;
    const jumpSpeed = 15 * gridSquareSize;
    const consumablePowerSpeedBoost = 0.06 * gridSquareSize;
    const consumablePowerJumpSpeedBoost = 0.06 * gridSquareSize;

    PhysicsState.prototype.gravityForce = gravityForce;

    this.resources = resources;
    this.gameCanvas = gameCanvas;
    this.uiCanvas = uiCanvas;
    this.renderer = new Renderer(gameCanvas);
    this.uiRenderer = new Renderer(uiCanvas);
    this.gameTimerDelay = 15;
    this.gameTimerInterval = null;
    this.keyboardState = {};
    this.lastTick = 0;
    this.world = null;
    this.camera = new Camera(new Rect(0, 0, this.renderer.size.width, this.renderer.size.height));
    this.world = new GameObject(new Rect(0, 0, worldWidth * gridSquareSize, worldHeight * gridSquareSize));
    this.ui = new UIElement(new Rect(0, 0, this.renderer.size.width, this.renderer.size.height));

    this.createWorld = function(){
      var player = new Player(new Rect(0, 0, gridSquareSize, 2*gridSquareSize));
      player.speed = speed;
      player.jumpSpeed = jumpSpeed;
      player.idleAnimation = Animation.withSingleRenderObject(RenderObject.fromImage(this.resources.idle));
      player.moveAnimationRight = Animation.withSpeedAndImage(1/15, this.resources.move, 40, 80, 6);
      player.moveAnimationLeft = Animation.withSpeedAndImage(1/15, this.resources.move_l, 40, 80, 6);
      player.moveAnimation = player.moveAnimationRight;
      player.jumpAnimation = Animation.withSingleRenderObject(RenderObject.fromImage(this.resources.jump));
      player.crouchAnimationRight = Animation.withSingleRenderObject(RenderObject.fromImage(this.resources.crouch));
      player.crouchAnimationLeft = Animation.withSingleRenderObject(RenderObject.fromImage(this.resources.crouch_l));
      player.crouchAnimation = player.crouchAnimationRight;
      player.crouchMoveAnimationRight = Animation.withSingleRenderObject(RenderObject.fromImage(this.resources.crouch));
      player.crouchMoveAnimationLeft = Animation.withSingleRenderObject(RenderObject.fromImage(this.resources.crouch_l));
      player.crouchMoveAnimation = player.crouchMoveAnimationRight;
      player.animation = player.idleAnimation;
      player.addChild(this.camera);
      // this.world.addChild(this.camera);

      this.world.addChild(player);

      var room = new Room(new Rect(0, 0, this.world.frame.width, this.world.frame.height), gridSquareSize, damageVelocityThreshold, damageVelocityMultiplier);
      room.ceiling.renderObject = RenderObject.fromColor(Color.black());
      room.wallLeft.renderObject = RenderObject.fromColor(Color.black());
      room.wallRight.renderObject = RenderObject.fromColor(Color.black());
      room.floor.renderObject = RenderObject.fromColor(Color.black());
      this.world.addChild(room);

      var count = ~~(worldWidth * worldHeight * itemChance);
      // var count = 0;
      var powerCount = ~~(count/2);
      player.maxPower = powerCount;
      var x = ~~(worldWidth - 2);
      var y = ~~(worldHeight - 2);
      var rndX, rndY;
      var takenX = [];
      var takenY = [];
      for (var i = 0; i < count; i++)
      {
        var taken = false;
        do {
          taken = false;
          rndX = rand(0, x - 1);
          rndY = rand(0, y - 1);
          for (var j = 0; j <= i; j++)
          {
            if (rndX == takenX[j] && rndY == takenY[j])
            {
              taken = true;
              break;
            }
          }
        } while(taken);

        takenX[i] = rndX;
        takenY[i] = rndY;

        var rect = new Rect(
          this.world.frame.width / 2 - gridSquareSize * 1.5 - rndX * gridSquareSize,
          this.world.frame.height / 2 - gridSquareSize * 1.5 - rndY * gridSquareSize,
          gridSquareSize,
          gridSquareSize);

        var gameObject;
        if (powerCount > 0)
        {
          gameObject = new Consumable(rect, consumablePowerSpeedBoost, consumablePowerJumpSpeedBoost);
          gameObject.renderObject = RenderObject.fromColor(Color.green());
          powerCount--;
        }
        else
        {
          gameObject = new Solid(rect, damageVelocityThreshold, damageVelocityMultiplier);
          gameObject.renderObject = RenderObject.fromImage(this.resources.brick);
        }
        this.world.addChild(gameObject);
      }

      this.deathText = new UIText(new Rect(0, 0, 0, 48), "You died! Game over!", Color.red(), "48px monospace");
      this.deathText.visible = false;
      this.ui.addChild(this.deathText);

      this.winText = new UIText(new Rect(0, 0, 0, 48), "Congratulations! You won!", Color.green(), "48px monospace");
      this.winText.visible = false;
      this.ui.addChild(this.winText);

      this.healthBarHolder = new UIElement(new Rect(
        -this.renderer.size.width / 2 + 64,
        -this.renderer.size.height / 2 + 10,
        120, 12));
      this.healthBarHolder.renderObject = RenderObject.fromColor(Color.black());
      this.ui.addChild(this.healthBarHolder);

      this.healthBar = new UIBar(new Rect(
        -this.renderer.size.width / 2 + 64,
        -this.renderer.size.height / 2 + 10,
        116, 8));
      this.healthBar.renderObject = RenderObject.fromColor(Color.red());
      this.healthBar.setValue(100);
      this.ui.addChild(this.healthBar);

      this.powerBarHolder = new UIElement(new Rect(
        this.renderer.size.width / 2 - 64,
        -this.renderer.size.height / 2 + 10,
        120, 12));
      this.powerBarHolder.renderObject = RenderObject.fromColor(Color.black());
      this.ui.addChild(this.powerBarHolder);

      this.powerBar = new UIBar(new Rect(
        this.renderer.size.width / 2 - 64,
        -this.renderer.size.height / 2 + 10,
        116, 9));
      this.powerBar.renderObject = RenderObject.fromColor(Color.green());
      this.powerBar.setValue(0);
      this.ui.addChild(this.powerBar);

      player.deathText = this.deathText;
      player.winText = this.winText;
      player.healthBar = this.healthBar;
      player.powerBar = this.powerBar;
    };

    this.run = function(){
      this.createWorld();
      this.lastTick = Date.now();
      this.gameTimerTick = this.gameTimerTick.bind(this);
      this.gameTimerTick();
    };

    this.gameTimerTick = function(){
      var ticks = Date.now();
      var dt = (ticks - this.lastTick) / 1000;
      var maxdt = 0.03;
      if (dt > maxdt) dt = maxdt;
      this.lastTick = ticks;

      this.renderer.clear();
      this.world.render(this.renderer, this.world.frame.getCenter(), this.camera.getGlobalPosition(), this.camera.frame.getSize());

      this.uiRenderer.clear();
      this.ui.render(this.uiRenderer, this.ui.frame.getCenter(), Vector.zero(), this.camera.originalSize);


      this.world.handleKeyboardState(this.keyboardState, dt);
      this.world.processPhysics(dt);
      this.world.detectCollisions(dt);
      this.world.animate(Animation.getTicks());

      requestAnimFrame(this.gameTimerTick.bind(this));
    };

    this.keyDown = function(code){
      this.keyboardState[code] = true;
      this.world.keyDown(code);
    };

    this.keyUp = function(code){
      delete this.keyboardState[code];
    };

    this.resize = function(){
      this.renderer.size = new Size(this.gameCanvas.width, this.gameCanvas.height);
      this.uiRenderer.size = new Size(this.uiCanvas.width, this.uiCanvas.height);
      this.camera.setSize(this.renderer.size);
      this.ui.frame.setSize(this.renderer.size);
      var healthBarNewCenter = new Vector(
        -this.renderer.size.width / 2 + 64,
        -this.renderer.size.height / 2 + 10);
      var powerBarNewCenter = new Vector(
        this.renderer.size.width / 2 - 64,
        -this.renderer.size.height / 2 + 10);
      this.healthBar.frame.setCenter(healthBarNewCenter);
      this.healthBarHolder.frame.setCenter(healthBarNewCenter);
      this.healthBar.resetOriginalFrame(new Rect(
        -this.renderer.size.width / 2 + 64,
        -this.renderer.size.height / 2 + 10,
        116, 8));
      this.healthBar.setValue(this.healthBar.getValue());
      this.powerBar.frame.setCenter(powerBarNewCenter);
      this.powerBarHolder.frame.setCenter(powerBarNewCenter);
      this.powerBar.resetOriginalFrame(new Rect(
        this.renderer.size.width / 2 - 64,
        -this.renderer.size.height / 2 + 10,
        116, 8));
      this.powerBar.setValue(this.powerBar.getValue());
    };
  };
});

