goog.provide('tm.Simulator');

goog.require('tm.Tiles')
goog.require('tm.Plant')
goog.require('tm.Weed')

tm.Simulator = function(world) {
    this.world = world;
    this.step = 0;
};
tm.Simulator.prototype = {
    simulate: function() {
        this.simulateTiles();
        this.simulateTermites();
        this.step++;
    },

    getStep: function() {
        return this.step;
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
        var redAlive = 0;
        var blueAlive = 0;
        for(var i = 0; i < this.world.termites.length; i++) {
            this.world.termites[i].simulate();
            if (this.world.termites[i].team == 0) {
                redAlive++;
            } else {
                blueAlive++;
            }
        }
        var aliveTermites = [];
        for(var i = 0; i < this.world.termites.length; i++) {
            var termite = this.world.termites[i];
            if(termite.energy > 0) {
                aliveTermites.push(termite);
            } else {
                this.world.setTermiteTile(termite.x, termite.y, null);
            }
        }
        if (redAlive == 0) {
            var termite = new tm.Termite(this.world, 0, Math.floor(Math.random()*50), Math.floor(Math.random()*50));
            termite.energy = 1000;
            aliveTermites.push(termite);
        }
        if (blueAlive == 0) {
            var termite = new tm.Termite(this.world, 1, Math.floor(Math.random()*50), Math.floor(Math.random()*50));
            termite.energy = 1000;
            aliveTermites.push(termite);
        }
        this.world.termites = aliveTermites;
    },

    getTeamPopulation: function(team) {
        var population = 0;
        for(var i = 0; i < this.world.termites.length; i++) {
            if(this.world.termites[i].team == team) {
                population ++;
            }
        }
        return population;
    },

    getTeamEnergy: function(team) {
        var energy = 0;
        for(var i = 0; i < this.world.termites.length; i++) {
            if(this.world.termites[i].team == team) {
                energy += this.world.termites[i].energy;
            }
        }
        return energy;
    },

};
