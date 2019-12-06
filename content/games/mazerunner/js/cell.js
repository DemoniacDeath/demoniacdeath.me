var Cell = function(x, y, borderRight, borderBottom){
    this.x = x;
    this.y = y;
    var borders = (borderRight?BORDER_RIGHT:0) | (borderBottom?BORDER_BOTTOM:0);
    this.getBorderRight = function(){
        return borders & BORDER_RIGHT;
    };
    this.getBorderBottom = function(){
        return borders & BORDER_BOTTOM;
    };
    this.getBorders = function(){
        return {
            right: this.getBorderRight(),
            bottom: this.getBorderBottom()
        };
    };
};