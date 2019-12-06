function _d(t){console.log(t)}

function rand(a, b)
{
    return Math.floor((Math.random() * (b + 1))) + a;
}

function extend(a, b){
    var result = {};
    for (var i in a)
    {
        result[i] = a[i];
    }
    for (var i in b)
    {
        result[i] = b[i];
    }
    return result;
}

var BORDER_RIGHT = 1;
var BORDER_BOTTOM = 2;

var Coords = function(x, y){
    this.x = x;
    this.y = y;
    this.isEqualTo = function(coords){
        return this.x == coords.x && this.y == coords.y;
    };
    this.distanceToSquared = function(coords){
        return Math.pow(coords.x-this.x, 2) + Math.pow(coords.y-this.y, 2);
    };
};

var Line = function(start, end){
    this.start = start;
    this.end = end;
};