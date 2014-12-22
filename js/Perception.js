goog.provide('tm.Perception');

goog.require('tm.Tiles');

tm.Perception = function(termite) {
    this.viewTile = function(x, y) {
        if (x*x + y*y > 9) { return tm.Tiles.NONE; }
        var absoluteX = x + termite.x;
        var absoluteY = y + termite.y;
        if(absoluteX < 0 || absoluteX >= termite.world.size || absoluteY < 0 || absoluteY >= termite.world.size) {
            return tm.Tiles.NONE;
        }
        return termite.world.getTile(absoluteX, absoluteY);
    };

    this.viewData = function(x, y) {
        if (x*x + y*y > 9) { return tm.Tiles.NONE; }
        var absoluteX = x + termite.x;
        var absoluteY = y + termite.y;
        if(absoluteX < 0 || absoluteX >= termite.world.size || absoluteY < 0 || absoluteY >= termite.world.size) {
            return 0;
        }
        return termite.world.getData(absoluteX, absoluteY);
    };

    this.x = function() { return termite.x; };

    this.y = function() { return termite.y; };

    this.energy = function() { return termite.energy; };
};


