define(function(require){
  var Color = function(r, g, b, a){
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
    this.toString = function(){
      var color = this.r * 0x100 * 0x100 + this.g * 0x100 + this.b;
      return '#' + ('00000' + (color).toString(16)).substr(-6);
    };
  };

  Color.fromRGB = function(r, g, b){
    return new Color(r, g, b, 0xff);
  };

  Color.black = function(){
    return new Color(0x00, 0x00, 0x00, 0xff);
  };

  Color.red = function(){
    return new Color(0xff, 0x00, 0x00, 0xff);
  };
  Color.green = function(){
    return new Color(0x00, 0xff, 0x00, 0xff);
  };
  Color.blue = function(){
    return new Color(0x00, 0x00, 0xff, 0xff);
  };
  return Color;
});
