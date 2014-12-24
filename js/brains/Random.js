goog.provide('tm.brains.Random');

tm.brains.Random = function(perception, memory) {
    var tile = perception.viewTile(0, 0);
    if(tile == tm.Tiles.PLANT || tile == tm.Tiles.WEED) { return tm.Action.EAT; }
    if(perception.energy() > 7000) { return tm.Action.REPRODUCE; }
    var actionIndex = Math.round(Math.random() * 5);
    return this.actions[actionIndex];
};
