define(function(require){
  var Size = require('./size');
  var Texture = require('./texture');
  var Renderer = function(canvas){
    var canvas = canvas;
    this.context = canvas.getContext("2d");
    this.size = new Size(canvas.width, canvas.height);
  };
  var createCanvas = function(width, height){
    var canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    return canvas;
  };

  Renderer.prototype.clear = function(){
    this.context.beginPath();
    this.context.clearRect(0, 0, this.size.width, this.size.height);
  };

  Renderer.prototype.drawImage = function(texture, x, y, width, height){
    this.context.drawImage(texture.image, 0, 0, texture.image.width, texture.image.height, x, y, width, height);
  };

  Renderer.textureFromColor = function(color){
    var texture = Renderer.createTexture();
    var ctx = texture.image.getContext("2d");
    texture.image.width = 1;
    texture.image.height = 1;
    ctx.fillStyle = color.toString();
    ctx.fillRect(0, 0, 1, 1);
    return texture;
  };

  Renderer.createTexture = function(width, height){
    return new Texture(createCanvas(width, height));
  };

  Renderer.createRenderer = function(width, height){
    return new Renderer(createCanvas(width, height));
  };

  return Renderer;
});
