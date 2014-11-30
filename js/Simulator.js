goog.provide('tm.Simulator');

goog.require('tm.Tiles')
goog.require('tm.Plant')
goog.require('tm.Weed')

tm.Simulator = function(world) {
    this.world = world;
};
tm.Simulator.prototype = {
    simulate: function() {
        this.simulateTiles();
        this.simulateTermites();
    },

    simulateTiles: function() {
        for(var x = 0; x < this.world.size; x++) {
            for(var y = 0; y < this.world.size; y++) {
                var tile = this.world.getTile(x, y); 
                var data = this.world.getData(x, y); 
                if(tile == tm.Tiles.PLANT) {
                    this.simulatePlant(x, y, data);
                }
                if(tile == tm.Tiles.WEED) {
                    this.simulateWeed(x, y, data);
                }
            }
        }

    },

    simulatePlant: function(x, y, data) {
        var age = data;
        var takeStep = Math.random() < 0.25;
        if(takeStep) {
            if(age == 4) {
                var childX = x + Math.floor(Math.random() * 6) - 3;
                var childY = y + Math.floor(Math.random() * 6) - 3;
                if(childX >= 0 && childX < this.world.size
                    && childY >= 0 && childY < this.world.size
                    && this.world.getTile(childX, childY) == tm.Tiles.NONE) {
                    this.world.setTile(childX, childY, tm.Tiles.PLANT);
                    this.world.setData(childX, childY, 0);
                }
            }
            if(age < 4) {
                this.world.setData(x, y, age + 1);
            }
        }
    },

    simulateWeed: function(x, y, data) {
        var age = data;
        var takeStep = Math.random() < 0.2;
        if(takeStep) {
            if(age == 4) {
                var childX = x + Math.floor(Math.random() * 6) - 3;
                var childY = y + Math.floor(Math.random() * 6) - 3;
                if(childX >= 0 && childX < this.world.size
                    && childY >= 0 && childY < this.world.size
                    && this.world.getTile(childX, childY) == tm.Tiles.NONE) {
                    this.world.setTile(childX, childY, tm.Tiles.WEED);
                    this.world.setData(childX, childY, 0);
                }
            }
            if(age < 4) {
                this.world.setData(x, y, age + 1);
            }
        }
    },

    simulateTermites: function() {
        for(var i = 0; i < this.world.termites.length; i++) {
            this.world.termites[i].simulate();
        }
        var aliveTermites = [];
        for(var i = 0; i < this.world.termites.length; i++) {
            var termite = this.world.termites[i];
            if(termite.energy > 0) {
                aliveTermites.push(termite);
            }
        }
        this.world.termites = aliveTermites;
        
    }
};
