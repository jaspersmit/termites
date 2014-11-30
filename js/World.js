goog.provide('tm.World');
goog.require('tm.Termite');


var worldSize = 50;

tm.World = {
    size: worldSize,
    tiles: Uint8Array(worldSize * worldSize),
    tileData: Uint8Array(worldSize * worldSize),
    
    termites: [],

    getTile: function(x, y) {
        return this.tiles[this.indexOfXY(x, y)];
    },

    setTile: function(x, y, tile) {
        this.tiles[this.indexOfXY(x, y)] = tile;
    },

    getData: function(x, y) {
        return this.tileData[this.indexOfXY(x, y)];
    },

    setData: function(x, y, data) {
        this.tileData[this.indexOfXY(x, y)] = data;
    },

    indexOfXY: function(x, y) {
        return x + this.size * y;
    }
};

