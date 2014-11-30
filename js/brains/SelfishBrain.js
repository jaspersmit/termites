goog.provide('tm.brains.SelfishBrain');

tm.brains.RandomBrain = function(perception, memory) {
    var tile = perception.tile;
    if(tile == tm.Tiles.PLANT || tile == tm.Tiles.WEED) { return tm.Action.EAT; }
    if(this.energy > 7000) { return tm.Action.REPRODUCE; }
    var actionIndex = Math.floor(Math.random() * 6);
    return this.actions[actionIndex];
};
