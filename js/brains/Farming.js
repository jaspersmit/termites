goog.provide('tm.brains.Farming');

//x, y
var actionToLocation = [ [0,0], [-1,0], [0,-1], [1,0], [0,1], [0,0] ];

tm.brains.Farming = function(perception, memory) {
    var x = perception.x();
    var y = perception.y();
    if(!memory.birthX) {
        memory.birthX = x;
        memory.birthY = y;
    }

    var tile = perception.viewTile(0, 0);
    if(x % 2 != 0 && y % 2 != 0 && tile == tm.Tiles.PLANT) { return tm.Action.EAT; }
    if(perception.energy() > 1000 && tile == tm.Tiles.WEED) { return tm.Action.EAT; }
    if(perception.energy() > 9000) { return tm.Action.REPRODUCE; }
    var tile = perception.viewTile(0, 0);
    if (perception.energy() < 4000) {
        var i = 0;
        var actionIndex = 0;
        do {
            actionIndex = Math.round(Math.random() * 5);
            i++;
        } while (i < 4 && perception.viewTile(actionToLocation[actionIndex]) == tm.Tiles.PLANT);
        return this.actions[actionIndex];
    } else {
        var actionIndex = Math.round(Math.random() * 5);
        return this.actions[actionIndex];
    }
};
