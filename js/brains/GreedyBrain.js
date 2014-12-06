goog.provide('tm.brains.GreedyBrain');

goog.require('tm.Tiles');
goog.require('tm.Action');


tm.brains.GreedyBrain = function(perception, memory) {
    if(!memory.children) {memory.children = 0; }
    if(perception.energy() > 7000) { 
        memory.children ++;
        return tm.Action.REPRODUCE; 
    }
    var gardening = memory.children >= 2 && perception.energy() > 4000;
    var tile = perception.viewTile(0, 0);
    if(tile == tm.Tiles.PLANT) { return tm.Action.EAT; }
    if(tile == tm.Tiles.WEED) { return tm.Action.EAT; }
    var centerOfGravityX = Math.random() - 0.5; //Hack to prevent ties
    var centerOfGravityY = Math.random() - 0.5;
    for(var x = -3; x <= 3; x++) {
        for(var y = -3; y <= 3; y++) {
            var tile = perception.viewTile(x, y);
            var data = perception.viewData(x, y);
            if(tile == tm.Tiles.PLANT) {
                centerOfGravityX += x * data;
                centerOfGravityY += y * data;
            } 
            if(tile == tm.Tiles.WEED) {
                var weedWeight = gardening ? 2 : -2;
                centerOfGravityX += weedWeight * x * data;
                centerOfGravityY += weedWeight * y * data;
            } 
        }
    }

    var headOrTail = Math.random() < 0.5;
    if(centerOfGravityX < 0) {
        if(centerOfGravityY < 0) {
            return headOrTail ? tm.Action.LEFT : tm.Action.UP;
        } else {
            return headOrTail ? tm.Action.LEFT : tm.Action.DOWN;
        }
    } else {
        if(centerOfGravityY < 0) {
            return headOrTail ? tm.Action.RIGHT : tm.Action.UP;
        } else {
            return headOrTail ? tm.Action.RIGHT : tm.Action.DOWN;
        }
    }


    var actionIndex = Math.floor(Math.random() * 6);
    return this.actions[actionIndex];
};
