define(function(require){
  var UIElement = require('./ui.element');
  var Renderer = require('../../renderer');
  var RenderObject = require('../../renderObject');
  var UIText = function(frame, text, color, font){
    UIElement.call(this, frame);

    this.text = text;
    this.color = color;
    this.font = font;
    this.createRenderObject();
  };

  UIText.prototype = Object.create(UIElement.prototype);
  UIText.prototype.constructor = UIText;
  UIText.prototype.super = UIElement.prototype;

  UIText.prototype.createRenderObject = function(){
    var texture = Renderer.createTexture(1, this.frame.height);
    var ctx = texture.image.getContext("2d");
    ctx.font = this.font;
    texture.image.width = ctx.measureText(this.text).width;
    this.frame.width = texture.image.width;
    ctx.font = this.font;
    ctx.fillStyle = this.color.toString();
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText(this.text, 0, 0);
    this.renderObject = new RenderObject(texture);
  };
  return UIText;
});
