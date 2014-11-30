goog.provide('tm.brains.RandomBrain');

tm.brains.RandomBrain = function(perception, memory) {
    var tile = perception.viewTile(0, 0);
    if(tile == tm.Tiles.PLANT || tile == tm.Tiles.WEED) { return tm.Action.EAT; }
    if(perception.energy() > 7000) { return tm.Action.REPRODUCE; }
    var actionIndex = Math.floor(Math.random() * 6);
    return this.actions[actionIndex];
};
