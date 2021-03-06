goog.provide('tm.Termite');

goog.require('tm.Action');
goog.require('tm.Tiles');
goog.require('tm.Perception');
goog.require('tm.Teams');

tm.Termite = function(world, team, x, y) {
    this.world = world;
    this.team = team;
    this.x = x;
    this.y = y;
    this.energy = 5000;
    this.brain = tm.Teams[team].brain;
    this.perception = new tm.Perception(this);
    this.memory = {};
    this.dna = {};
    this.age = 0;
};

tm.Termite.prototype = {
    simulate: function() {
        var action = this.think();
        this.performAction(action);
        this.energy -= 10;
        this.age++;
    },

    actions: [tm.Action.STAY, tm.Action.LEFT, tm.Action.UP, tm.Action.RIGHT, tm.Action.DOWN, tm.Action.EAT, tm.Action.REPRODUCE],

    think: function() {
        return this.brain(this.perception, this.memory, this.dna);
    },

    performAction: function(action) {
        this.world.setTermiteTile(this.x, this.y, null);
        if(action == tm.Action.LEFT) {
            var newX = this.x - 1;
            if(newX >= 0 && !this.world.getTermiteTile(newX, this.y)) {
                this.x = newX;
            }
        }
        if(action == tm.Action.RIGHT) {
            var newX = this.x + 1;
            if(newX < this.world.size && !this.world.getTermiteTile(newX, this.y)) {
                this.x = newX;
            }
        }
        if(action == tm.Action.UP) {
            var newY = this.y - 1;
            if(newY >= 0 && !this.world.getTermiteTile(this.x, newY)) {
                this.y = newY;
            }
        }
        if(action == tm.Action.DOWN) {
            var newY = this.y + 1;
            if(newY < this.world.size && !this.world.getTermiteTile(this.x, newY)) {
                this.y = newY;
            }
        }
        if(action == tm.Action.EAT) {
            var tile = this.world.getTile(this.x, this.y);
            var data = this.world.getData(this.x, this.y);
            if(tile == tm.Tiles.PLANT) {
                this.energy += tm.Plant.getNutritionalValue(data);
                this.world.setTile(this.x, this.y, tm.Tiles.NONE);
                this.world.setData(this.x, this.y, 0);
            }
            if(tile == tm.Tiles.WEED) {
                this.energy += tm.Weed.getNutritionalValue(data);
                this.world.setTile(this.x, this.y, tm.Tiles.NONE);
                this.world.setData(this.x, this.y, 0);
            }
        }
        if(action == tm.Action.REPRODUCE && this.energy > 4000) {
            this.energy -= 4000;
            var child = new tm.Termite(this.world, this.team, this.x, this.y);
            child.energy = 1000;
            if(this.brain.mutate) {
                child.dna = this.brain.mutate(this.dna);
            }
            this.world.addTermite(child);
        }
        this.world.setTermiteTile(this.x, this.y, this);
        this.energy = Math.min(this.energy, 10000);
    }
};
