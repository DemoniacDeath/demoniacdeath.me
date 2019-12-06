var MazeGenerator = function(){
    var MazeGeneratorCell = function(borderRight, borderBottom, setNumber){
        this.borderRight = borderRight;
        this.borderBottom = borderBottom;
        this.setNumber = setNumber;
    };
    var private = function(){
        var that = this;

        //private
        that.nextSetNumber = 1;
        that.getNextSetNumber = function(){
            return that.nextSetNumber++;
        };
        that.resetNextSetNumber = function(){
            that.nextSetNumber = 1;
        };
        that.shouldPlaceRightBorder = function(){
            return rand(0, 1);
        };
        that.shouldPlaceBottomBorder = function(){
            return rand(0, 1);
        };

        //public
        that.generateMaze = function(sizeX, sizeY){
            var result = [];
            if (sizeX < 2)
                throw new Error('width cannot be less than 2');
            if (sizeY < 2)
                throw new Error('height cannot be less than 2');

            var a = [];
            that.resetNextSetNumber();
            for (var y = 0; y < sizeY; y++)
            {
                for (var x = 0; x < sizeX; x++)
                {
                    if (!a[y])
                        a[y] = [];
                    if (!y)
                    {
                        a[y][x] = new MazeGeneratorCell(false, false, 0);
                    }
                    else
                    {
                        a[y][x] = new MazeGeneratorCell(false, a[y-1][x].borderBottom, a[y-1][x].setNumber);
                        if (a[y][x].borderBottom)
                            a[y][x].setNumber = 0;
                        a[y][x].borderBottom = false;
                    }
                    if (!a[y][x].setNumber)
                        a[y][x].setNumber = that.getNextSetNumber();
                }
                for (x = 0; x < sizeX-1;x++)
                {
                    var shouldPlaceRightBorder = that.shouldPlaceRightBorder();
                    if (a[y][x].setNumber == a[y][x+1].setNumber)
                        shouldPlaceRightBorder = true;//prevent the loops
                    if (shouldPlaceRightBorder)
                    {
                        a[y][x].borderRight = true;
                    }
                    else
                    {
                        //If we choose not to add a wall, union the sets
                        var previousSetNumber = a[y][x+1].setNumber;
                        for (var c = 0; c < sizeX; c++)
                        {
                            if (a[y][c].setNumber == previousSetNumber)
                                a[y][c].setNumber = a[y][x].setNumber;
                        }
                    }
                }
                //Ensure that each set has at least one cell with a down passage (i.e. without a bottom wall). Failure to do so will create an isolation.
                var sets = {};
                for (x = 0; x < sizeX; x++)
                {
                    if (!sets[a[y][x].setNumber])
                        sets[a[y][x].setNumber] = [];
                    sets[a[y][x].setNumber].push(a[y][x]);
                }
                for (var setNumber in sets)
                {
                    var set = sets[setNumber];
                    var numberOfBottomBorders = rand(0, set.length-1);
                    while (numberOfBottomBorders)
                    {
                        for (var z in set)
                        {
                            if (!numberOfBottomBorders)
                                break;
                            if (that.shouldPlaceBottomBorder())
                            {
                                set[z].borderBottom = true;
                                numberOfBottomBorders--;
                            }
                        }
                    }
                }
                if (y == sizeY - 1)
                {
                    for (x = 0; x < sizeX-1; x++)
                    {
                        if (a[y][x].setNumber != a[y][x+1].setNumber)
                        {
                            a[y][x].borderRight = false;
                            //If we choose not to add a wall, union the sets
                            var previousSetNumber = a[y][x+1].setNumber;
                            for (c = 0; c < sizeX; c++)
                            {
                                if (a[y][c].setNumber == previousSetNumber)
                                    a[y][c].setNumber = a[y][x].setNumber;
                            }
                        }
                    }
                }
            }
            
            for (y = 0; y < sizeY; y++)
            {
                result[y] = [];
                for (x = 0; x < sizeX; x++)
                {
                    result[y][x] = new Cell(x, y, a[y][x].borderRight, a[y][x].borderBottom);
                }
            }
            return result;
        }
    };
    var _p = new private();
    return {
        generateMaze: _p.generateMaze
    };
};