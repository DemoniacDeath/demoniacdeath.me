var Solver = function(matrix){
    var private = function(matrix){
        var that = this;

        //private
        that.matrix = matrix;
        that.enabled = true;
        that.moves = [];
        that.pushMove = function(coords){
            that.moves.push(coords);
        };
        that.popMove = function(){
            return that.moves.pop();
        };
        that.preLastMove = function(){
            return that.moves[that.moves.length-2];
        };
        that.lastMove = function(){
            return that.moves[that.moves.length-1];
        };

        //public
        that.move = function(coords){
            if (!that.enabled)
                return;
            var lastMove = that.lastMove();
            var preLastMove = that.preLastMove();

            if (preLastMove && coords.isEqualTo(preLastMove))
            {
                that.popMove();
            }
            else if (!lastMove)
            {
                that.pushMove(coords);
            }
            else
            {
                if (coords.distanceToSquared(lastMove) != 1)
                    return;

                if (coords.x >= that.matrix.width ||
                    coords.x < 0 ||
                    coords.y >= that.matrix.height ||
                    coords.y < 0)
                    return;

                var newCell = that.matrix.cells[coords.y][coords.x];
                var oldCell = that.matrix.cells[lastMove.y][lastMove.x];

                if ((newCell.x < oldCell.x && newCell.getBorderRight()) ||
                    (newCell.y < oldCell.y && newCell.getBorderBottom()) ||
                    (newCell.x > oldCell.x && oldCell.getBorderRight()) ||
                    (newCell.y > oldCell.y && oldCell.getBorderBottom()))
                {
                    return;
                }


                
                that.pushMove(coords);
                return true;
            }

        };
        that.restart = function(matrix){
            that.matrix = matrix;
            that.enabled = true;
            that.moves = [];
        };
        that.setEnabled = function(enabled){
            that.enabled = enabled;
        };
        that.forEach = function(callback){
            var coords = null;
            var lastCoords = null;
            for (var i in that.moves) {
                if (coords)
                    lastCoords = coords;
                var coords = that.moves[i];
                if (lastCoords && coords)
                {
                    callback(new Line(lastCoords, coords));
                }
            }
        };
        that.lastCoords = function(){
            return that.lastMove();
        };
        that.preLastCoords = function(){
            return that.preLastMove();
        };
    };
    var _p = new private(matrix);
    return {
        move: _p.move,
        restart: _p.restart,
        setEnabled: _p.setEnabled,
        forEach: _p.forEach,
        lastCoords: _p.lastCoords,
        preLastCoords: _p.preLastCoords
    };
};