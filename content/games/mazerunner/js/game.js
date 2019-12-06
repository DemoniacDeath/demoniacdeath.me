var Game = function(canvas, cellSizeX, cellSizeY, autoSolverDelay) {
    var private = function(canvas, cellSizeX, cellSizeY, autoSolverDelay){
        var that = this;

        that.defaultStrokeColor = '#000000';
        that.defaultFillColor = '#FFFFFF';
        that.solverColor = '#00FF00';

        that.won = false;
        that.canvas = canvas;
        that.cellSizeX = cellSizeX;
        that.cellSizeY = cellSizeY;
        that.context = that.canvas.getContext("2d");
        that.maxWidth = that.canvas.width;
        that.maxHeight = that.canvas.height;
        that.cellCountX = that.maxWidth/that.cellSizeX;
        that.cellCountY = that.maxHeight/that.cellSizeY;
        that.matrix = null;
        that.solver = null;
        that.lastCellCoords = new Coords(0,0);
        that.autoSolverTimeOut = null;
        that.autoSolverDelay = autoSolverDelay || 10;
        that.autoSolveStarted = false;

        that.drawCellBorder = function(x, y, v){
            var startCoords = new Coords(x*that.cellSizeX, y*that.cellSizeY);
            var endCoords = new Coords(x*that.cellSizeX, y*that.cellSizeY);
            if (v)
                endCoords.y += (that.cellSizeY);
            else
                endCoords.x += (that.cellSizeX);
            that.drawLine(startCoords, endCoords);
        }

        that.drawLine = function(from, to, color){
            that.context.beginPath();
            if (color)//set color
                that.context.strokeStyle=color;
            that.context.moveTo(from.x,from.y);
            that.context.lineTo(to.x, to.y);
            that.context.stroke();
            if (color)//reset color
                that.context.strokeStyle=that.defaultStrokeColor;
        }

        that.drawRect = function(from, width, height, color){
            that.context.beginPath();
            if (color)//set color
                that.context.fillStyle=color;
            that.context.fillRect(from.x,from.y, width, height);
            if (color)//reset color
                that.context.fillStyle=that.defaultStrokeColor;
        };

        that.handleMousePosition = function(coords){
            if (that.won || that.autoSolveStarted)
                return;
            var cellCoords = new Coords(~~(coords.x / that.cellSizeX),~~(coords.y / that.cellSizeY));
            if (!cellCoords.isEqualTo(that.lastCellCoords))
            {
                that.lastCellCoords = cellCoords;
                if (that.solver.move(cellCoords))
                {
                    that.checkWin();
                }
                that.render();
            }
        }

        that.run = function(){
            var generator = new MazeGenerator();
            that.matrix = new CellMatrix(generator.generateMaze(that.cellCountX, that.cellCountY));
            that.solver = new Solver(that.matrix);
            that.solver.move(that.lastCellCoords);

            that.render();

            //init event handlers
            that.canvas.addEventListener("mousemove", function(e){
                that.handleMousePosition(new Coords(e.pageX - this.offsetLeft, e.pageY - this.offsetTop));
            });
        };

        that.rerun = function(){
            that.clear();
            that.lastCellCoords = new Coords(0,0);
            that.won = false;
            
            var generator = new MazeGenerator();
            that.matrix = new CellMatrix(generator.generateMaze(that.cellCountX, that.cellCountY));
            that.solver = new Solver(that.matrix);
            that.solver.move(that.lastCellCoords);

            that.render();
        };

        that.startAutoSolve = function(){
            if (that.won)
                return;
            that.lastCellCoords = new Coords(0,0);
            that.autoSolveStarted = true;
            that.solver = new AutoSolver(that.matrix);
            that.solver.move(that.lastCellCoords);
            that.autoSolve();
        };

        that.autoSolve = function(){
            that.autoSolverTimeOut = null;
            if (that.won || !that.autoSolveStarted)
                return;
            that.solver.solve();
            if (!that.checkWin())
            {
                that.autoSolverTimeOut = setTimeout(that.autoSolve, that.autoSolverDelay);
            }
            that.render();
        };

        that.checkWin = function(){
            if (that.solver.lastCoords().x == that.matrix.width-1 &&
                that.solver.lastCoords().y == that.matrix.height-1)
            {
                that.win();
                return true;
            }
        };

        that.win = function(){
            that.solver.setEnabled(false);
            that.won = true;
            that.autoSolveStarted = false;
            // alert('you won!');
        };

        that.renderBorderLines = function(){
            for (var i = 0; i < that.cellCountX; i++)
            {
                that.drawCellBorder(i, 0, false);
                that.drawCellBorder(i, that.cellCountY, false);
            }
            for (var j = 0; j < that.cellCountY; j++)
            {
                if (j != 0)
                    that.drawCellBorder(0, j, true);
                if (j != that.cellCountY - 1)
                    that.drawCellBorder(that.cellCountX, j, true);
            }
        };

        that.clear = function(){
            that.context.beginPath();
            that.context.clearRect(0, 0, that.canvas.width, that.canvas.height);
        };

        that.render = function(){
            var marginX = 2;
            var marginY = 2;
            that.clear();
            that.renderBorderLines();
            that.matrix.forEach(function(cell){
                if (cell.getBorderBottom()
                    &&
                    cell.y < that.cellCountY - 1) //Do not draw on the bottom edge of the canvas here.
                {
                    that.drawCellBorder(cell.x, cell.y + 1, false );
                }

                if (cell.getBorderRight()
                    &&
                    cell.x < that.cellCountX - 1) //Do not draw on the right edge of the canvas here.
                {
                    that.drawCellBorder(cell.x + 1, cell.y, true );
                }
            });
            if (that.won && that.solver.forEachVisited)
            {
                that.solver.forEachVisited(function(coords){
                    that.drawRect(
                        new Coords(that.cellSizeX*coords.x+marginX, that.cellSizeY*coords.y+marginY),
                        that.cellSizeX-marginX*2,
                        that.cellSizeY-marginX*2,
                        '#ffff00'
                    );
                });
            }
            that.solver.forEach(function(line){
                if (that.won)
                {
                    that.drawRect(
                        new Coords(that.cellSizeX*line.start.x+marginX, that.cellSizeY*line.start.y+marginY),
                        that.cellSizeX-marginX*2,
                        that.cellSizeY-marginX*2,
                        that.solverColor
                    );
                    that.drawRect(
                        new Coords(that.cellSizeX*line.end.x+marginX, that.cellSizeY*line.end.y+marginY),
                        that.cellSizeX-marginX*2,
                        that.cellSizeY-marginX*2,
                        that.solverColor
                    );
                }
                else
                {
                    that.drawLine(
                        new Coords(that.cellSizeX*(line.start.x+0.5), that.cellSizeY*(line.start.y+0.5)),
                        new Coords(that.cellSizeX*(line.end.x+0.5), that.cellSizeY*(line.end.y+0.5)),
                        that.solverColor
                    );
                }
            });
        };
    };
    var _p = new private(canvas, cellSizeX, cellSizeY, autoSolverDelay);
    return {
        run: _p.run,
        rerun: _p.rerun,
        startAutoSolve: _p.startAutoSolve,
        canvas: _p.canvas
    };
};