var CellMatrix = function(width, height, createCell){
    this.cells = [];
    this.width = 0;
    this.height = 0;

    if (width instanceof Array)
    {
        var cells = width;
        this.cells = cells.map(function(row){
            return row.slice();//clone
        });
    }
    else if (width instanceof CellMatrix)
    {
        var matrix = width;
        this.cells = matrix.cells.map(function(row){
            return row.slice();//clone
        });
    }
    else if (typeof width === 'number' && typeof height === 'number' && createCell instanceof Function)
    {
        for (var j = 0; j <= height; j++)
        {
            this.cells[j] = [];
            for (var i = 0; i <= width; i++)
            {
                this.cells[j][i] = createCell(i, j);
            }
        }
    }
    else
    {
        throw new Error("Provided argument list is not supported");
    }
    this.height = this.cells.length;
    this.width = this.cells[0].length;

    this.forEach = function(callback){
        for (j in this.cells)
            for (i in this.cells[j])
                callback(this.cells[j][i]);
    };
};