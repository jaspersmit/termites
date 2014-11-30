goog.provide('tm.Termite');

goog.require('tm.Action');

tm.Termite = function(world, team, x, y) {
    this.world = world;
    this.team = team;
    this.x = x;
    this.y = y;
    this.energy = 5000;
};

tm.Termite.prototype = {
    simulate: function() {
        var action = this.think();
        this.performAction(action);
        this.energy -= 10;
    },


    actions: [tm.Action.STAY, tm.Action.LEFT, tm.Action.UP, tm.Action.RIGHT, tm.Action.DOWN, tm.Action.EAT, tm.Action.REPRODUCE],

    think: function() {
        var tile = this.world.getTile(this.x, this.y);
        if(tile == tm.Tiles.PLANT || tile == tm.Tiles.WEED) { return tm.Action.EAT; }
        if(this.energy > 7000) { return tm.Action.REPRODUCE; }
        var actionIndex = Math.floor(Math.random() * 6);
        return this.actions[actionIndex];
    },

    performAction: function(action) {
        if(action == tm.Action.LEFT) {
            var newX = this.x - 1;
            if(newX >= 0) {
                this.x = newX;
            }
        }
        if(action == tm.Action.RIGHT) {
            var newX = this.x + 1;
            if(newX < this.world.size) {
                this.x = newX;
            }
        }
        if(action == tm.Action.UP) {
            var newY = this.y - 1;
            if(newY >= 0) {
                this.y = newY;
            }
        }
        if(action == tm.Action.DOWN) {
            var newY = this.y + 1;
            if(newY < this.world.size) {
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
            this.world.termites.push(child);
        }
    }
};
