var game;

function _d(t){console.log(t)}

function rand(a, b)
{
  return Math.floor(Math.random() * (b - a + 1)) + a;
}

// A cross-browser requestAnimationFrame
// See https://hacks.mozilla.org/2011/08/animating-with-javascript-from-setinterval-to-requestanimationframe/
var requestAnimFrame = (function(){
  return window.requestAnimationFrame  ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame    ||
    window.oRequestAnimationFrame      ||
    window.msRequestAnimationFrame     ||
    function(callback){
      window.setTimeout(callback, 1000 / 33);
    };
})();

requirejs(['./game', 'https://cdnjs.cloudflare.com/ajax/libs/nipplejs/0.7.3/nipplejs.min.js'], function(Game,Nipple){
  var resources = {
    move: {url: 'img/move.png', width: 40, height: 480},
    move_l: {url: 'img/move_l.png', width: 40, height: 480},
    brick: {url: 'img/brick.png', width: 40, height: 40},
    crouch: {url: 'img/crouch.png', width: 40, height: 40},
    crouch_l: {url: 'img/crouch_l.png', width: 40, height: 40},
    idle: {url: 'img/idle.png', width: 40, height: 80},
    jump: {url: 'img/jump.png', width: 40, height: 80}
  };
  var loadResources = function(resources, mainCallback){
    for (var index in resources)
    {
      var url = resources[index].url;
      var image = new Image();
      image.width = resources[index].width;
      image.height = resources[index].height;
      image.onload = function(index, image){
        return function(){
          resources[index] = image;
          var allDone = true;
          for (var i in resources) {
            if (!(resources[i] instanceof Image))
              allDone = false;
          }
          if (allDone)
            mainCallback(resources);
        };
      }(index, image);
      image.src = url;
    }
  };
  loadResources(resources, function(resources){
    var gameCanvas = document.getElementById('game');
    var uiCanvas = document.getElementById('ui');
    var setCanvasSize = function(canvas){
      var style = window.getComputedStyle(canvas);
      canvas.width = ~~style.width.replace('px', '');
      canvas.height = ~~style.height.replace('px', '');
    };
    setCanvasSize(gameCanvas);
    setCanvasSize(uiCanvas);
    game = new Game(gameCanvas, uiCanvas, resources);
    game.run();
    var joystickManager = Nipple.create({
      zone: document.getElementById('ui'),
      threshold: 0.1,
      dataOnly: true,
      multitouch: true
    });
    joystickManager.on('dir plain end', (e, j) => {
      game.keyUp('KeyW');
      game.keyUp('KeyS');
      game.keyUp('KeyA');
      game.keyUp('KeyD');
      switch(e.type) {
        case 'dir':
        case 'plain':
          switch(j.direction.angle) {
            case 'up': game.keyDown('KeyW'); break;
            case 'down': game.keyDown('KeyS'); break;
          }
          switch(j.direction.x) {
            case 'left': game.keyDown('KeyA'); break;
            case 'right': game.keyDown('KeyD'); break;
          }
      }
    });
    document.addEventListener("keydown", function(e){
      game.keyDown(e.code);
    }, false);
    document.addEventListener("keyup", function(e){
      game.keyUp(e.code);
    }, false);
    window.addEventListener("resize", function(){
      setCanvasSize(gameCanvas, uiCanvas);
      game.resize();
    });
  });
});
