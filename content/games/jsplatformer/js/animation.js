define(function(require){
  var Rect = require('./rect');
  var Renderer = require('./renderer');
  var RenderObject = require('./renderObject');
  var Animation = function(speed, frames, startTick){
    const _speedScale = 1000;
    this.speed = speed;
    this.startTick = startTick || Animation.getTicks();
    this.frames = frames || [];

    this.animate = function(ticks){
      if (ticks - this.startTick >= this.frames.length * this.speed * _speedScale)
        this.startTick = ticks;
      var frameIndex = ~~((ticks - this.startTick) / (this.speed * _speedScale));
      return this.frames[frameIndex];
    };
  };

  Animation.getTicks = function(){
    return Date.now();
  };

  Animation.withSingleRenderObject = function(renderObject, ticks){
    ticks = ticks || Animation.getTicks();

    return new Animation(1, [renderObject], ticks);
  };

  Animation.withSpeedAndTwoColors = function(speed, color1, color2, ticks){
    ticks = ticks || Animation.getTicks();

    return new Animation(speed, [
      RenderObject.fromColor(color1),
      RenderObject.fromColor(color2)
    ], ticks);
  };

  Animation.withSpeedAndImage = function(speed, image, width, height, framesNumber, ticks){
    ticks = ticks || Animation.getTicks();

    var frames = [];
    var rect = new Rect(0, 0, width, height);

    for (var i = 0; i < framesNumber; i++)
    {
      var texture = Renderer.createTexture(width, height);
      var ctx = texture.image.getContext("2d");
      ctx.drawImage(image, rect.x, rect.y, rect.width, rect.height, 0, 0, rect.width, rect.height);
      frames.push(new RenderObject(texture));

      rect.y = i * rect.height;
    }
    return new Animation(speed, frames, ticks);
  };
  return Animation;
});
