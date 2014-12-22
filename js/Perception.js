goog.provide('tm.Perception');

goog.require('tm.Tiles');
goog.require('tm.World');

tm.Perception = function(termite) {
    this.viewTile = function(x, y) {
        if (x*x + y*y > 9) { return tm.Tiles.NONE; }
        var absoluteX = x + termite.x;
        var absoluteY = y + termite.y;
        if(absoluteX < 0 || absoluteX >= termite.world.size || absoluteY < 0 || absoluteY >= termite.world.size) {
            return tm.Tiles.NONE;
        }
        for(var i = 0; i < termite.world.termites.length; i++) {
            var other = termite.world.termites[i];
            if (other.x == x && other.y == y) {
                if (other.team == termite.team) {
                    return tm.Tiles.FRIEND;
                } else {
                    return tm.Tiles.ENEMY;
                }
            }
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


