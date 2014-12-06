goog.provide('tm.brains.FarmingBrain');

tm.brains.FarmingBrain = function(perception, memory) {
    var x = perception.x();
    var y = perception.y();
    if(!memory.birthX) {
        memory.birthX = x;
        memory.birthY = y;
    }

    var tile = perception.viewTile(0, 0);
    if(x % 2 != 0 && y % 2 != 0 && tile == tm.Tiles.PLANT) { return tm.Action.EAT; }
    if(tile == tm.Tiles.WEED) { return tm.Action.EAT; }
    if(perception.energy() > 7000) { return tm.Action.REPRODUCE; }
    var actionIndex = Math.floor(Math.random() * 6);
    return this.actions[actionIndex];
};
