goog.provide('tm.Renderer');

goog.require('tm.World');
goog.require('tm.Tiles');


tm.Renderer = function(canvas, world) {
    this.canvas = canvas;
    this.world = world;
    this.width = parseInt(canvas.getAttribute('width'));
    this.height = parseInt(canvas.getAttribute('height'));
    this.tileSize = this.width / world.size;
};
tm.Renderer.prototype = {
    render: function() {
        var context = this.canvas.getContext('2d');
        this.renderBackground(context);
        this.renderTiles(context);
        this.renderTermites(context);
    },

    renderBackground: function(context) {
        context.fillStyle = 'black';
        context.fillRect(0, 0, this.width, this.height);
    },

    renderTiles: function(context) {
        for(var x = 0; x < this.world.size; x++) {
            for(var y = 0; y < this.world.size; y++) {
                context.save();
                context.translate(x * this.tileSize, y * this.tileSize);
                this.renderTile(context, this.world.getTile(x, y), this.world.getData(x, y));
                context.restore();
            }
        }
    },

    renderTile: function(context, tile, data) {
        if(tile == tm.Tiles.PLANT) {
            context.fillStyle = this.plantColors[data];
            context.fillRect(0, 0, this.tileSize, this.tileSize);
        } else if(tile == tm.Tiles.WEED) {
            context.fillStyle = this.weedColors[data];
            context.fillRect(0, 0, this.tileSize, this.tileSize);
        }
    },

    renderTermites: function(context) {
        for(var i = 0; i < this.world.termites.length; i++) {
            var termite = this.world.termites[i];
            context.save();
            context.translate(termite.x * this.tileSize, termite.y * this.tileSize);
            this.renderTermite(context, termite);
            context.restore();
        }
    },

    renderTermite: function(context, termite) {
        var brightness = Math.floor(128 + Math.max(128, termite.energy / 4000 * 128));
        var color = termite.team == 0 ? 'rgba(' + brightness + ', 0, 0, 1)' : 'rgba(0, 0, ' + brightness + ', 1)';
        context.fillStyle = color;
        context.fillRect(0, 0, this.tileSize, this.tileSize);
    },

    plantColors:  ['rgba(0, 100, 0, 1)', 'rgba(0, 120, 0, 1)', 'rgba(0, 150, 0, 1)', 'rgba(0, 180, 0, 1)', 'rgba(0, 220, 0, 1)'],
    weedColors:  ['rgba(100, 100, 100, 1)', 'rgba(120, 120, 120, 1)', 'rgba(150, 150, 150, 1)', 'rgba(180, 180, 180, 1)', 'rgba(220, 220, 220, 1)']
};

