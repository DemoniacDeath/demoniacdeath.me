var AutoSolver = function(matrix, winCallback){
	var private = function(matrix, winCallback){
        var that = this;

        that.timeOut = null;
        that.active = false;
        that.matrix = matrix;
        that.winCallback = function(){
        	clearTimeout(that.timeOut);
        	that.active = false;
        	if (winCallback)
        		winCallback();
        };
        that.parent = new Solver(matrix, that.winCallback);
        that.visited = {};

        //public
        that.solve = function(){
        	var moved = false;
        	var lastCoords = that.parent.lastCoords();
        	var preLastCoords = that.parent.preLastCoords();
        	if (!lastCoords)
        		return false;
        	if (!that.visited[lastCoords.x+','+lastCoords.y])
        		that.visited[lastCoords.x+','+lastCoords.y] = {
        			right: false,
        			down: false,
        			left: false,
        			up: false
        		};
        	//choose direction to move
        	var directions = {
        		right: new Coords(1, 0),
        		down: new Coords(0, 1),
        		left: new Coords(-1, 0),
        		up: new Coords(0, -1),
        	};
        	//first try to go to a not-visited direction
        	for (var direction in directions)
        	{
        		var offsetCoords = directions[direction];
        		var newCoords = new Coords(lastCoords.x+offsetCoords.x,lastCoords.y+offsetCoords.y);
        		if (preLastCoords &&
        			preLastCoords.x == newCoords.x &&
        			preLastCoords.y == newCoords.y)
        		{
        			that.visited[lastCoords.x+','+lastCoords.y][direction] = true;
        		}
        		if (that.visited[lastCoords.x+','+lastCoords.y][direction])
        			continue;
        		that.visited[lastCoords.x+','+lastCoords.y][direction] = true;
        		if (that.parent.move(newCoords))
        		{
        			var moved = true;
        			break;
        		}
        	}
	       	if (!moved)
	       	{
	       		that.parent.move(preLastCoords);
	       		moved = true;
	       	}
        };
        that.forEachVisited = function(callback){
	        for (var i in that.visited)
	        {
	        	var coords = new Coords(~~i.split(',')[0], ~~i.split(',')[1]);
	        	var visitedDirections = that.visited[i];
	        	var directions = {
	        		down: new Coords(0, 1),
	        		left: new Coords(-1, 0),
	        		up: new Coords(0, -1),
	        		right: new Coords(1, 0)
	        	};
	        	for (var direction in directions) {
	        		if (visitedDirections[direction]) {
	        			var visitedCoords = new Coords(coords.x + directions[direction].x, coords.y + directions[direction].y);
	        			callback(visitedCoords);
	        		}
	        	}
	        }
        }
	};
    var _p = new private(matrix, winCallback);
    return extend(_p.parent, {
    	solve: _p.solve,
    	forEachVisited: _p.forEachVisited
    });
};