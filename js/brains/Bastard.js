goog.provide('tm.brains.Bastard');

goog.require('tm.Tiles');
goog.require('tm.Action');


var bastardActions = [
tm.Action.UP, tm.Action.RIGHT, tm.Action.DOWN, tm.Action.RIGHT, tm.Action.UP, tm.Action.RIGHT, 
    tm.Action.DOWN, tm.Action.DOWN, tm.Action.DOWN,
    tm.Action.LEFT, tm.Action.UP, tm.Action.LEFT, tm.Action.DOWN, tm.Action.LEFT, tm.Action.UP, tm.Action.UP];

var initActions = [tm.Action.LEFT, tm.Action.DOWN, tm.Action.RIGHT, tm.Action.UP];
tm.brains.Bastard = function(perception, memory) {
    if(!('cycle' in memory)) { 
        memory.cycle = -3; 
        memory.initAction = initActions[Math.round(Math.random() * 3)];
        return memory.initAction;
    }
    if(memory.cycle < 0) {
        memory.cycle++;
        return memory.initAction;
    }
    var tile = perception.viewTile(0, 0);
    var data = perception.viewData(0, 0);

    if(memory.cycle == 0 && perception.energy() > 7000) {
        return tm.Action.REPRODUCE;
    }
    if(tile == tm.Tiles.PLANT && data >= 4) {
        return tm.Action.EAT;
    }
    if(tile == tm.Tiles.WEED) { return tm.Action.EAT; }
    memory.cycle = (memory.cycle + 1) % bastardActions.length;
    return bastardActions[memory.cycle];

};
