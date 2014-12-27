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
                if(tile == tm.Tiles.NONE) {
                    this.createWeed(x, y);
                }
                if(tile == tm.Tiles.PLANT) {
                    this.simulatePlant(x, y, data);
                }
                if(tile == tm.Tiles.WEED) {
                    this.simulateWeed(x, y, data);
                }
            }
        }

    },

    createWeed: function(x, y) {
        var takeStep = Math.random() < 0.00003;
        if (takeStep) {
            this.world.setTile(x, y, tm.Tiles.WEED);
        }
    },

    simulatePlant: function(x, y, data) {
        var age = data;
        var takeStep = Math.random() < 0.12;
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
        var takeStep = Math.random() < 0.13;
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
        this.removeStarvedTermites();
    },

    removeStarvedTermites: function() {
        var aliveTermites = [];
        var starvedTermites = [];
        for(var i = 0; i < this.world.termites.length; i++) {
            var termite = this.world.termites[i];
            if(termite.energy > 0) {
                aliveTermites.push(termite);
            } else {
                starvedTermites.push(termite);
            }
        }
        this.world.termites = aliveTermites;
        for(var i = 0; i < starvedTermites.length; i++) {
            this.handleStarvation(starvedTermites[i]);
        }
    },

    handleStarvation: function(deadTermite) {
        this.world.setTermiteTile(deadTermite.x, deadTermite.y, null);
        this.world.population[deadTermite.team]--;
        if(this.world.population[deadTermite.team] == 0) {
            var reincarnation = new tm.Termite(this.world, deadTermite.team, Math.floor(Math.random()*50), Math.floor(Math.random()*50));
            reincarnation.energy = 5000;
            this.world.addTermite(reincarnation);
        }
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
