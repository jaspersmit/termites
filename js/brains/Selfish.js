goog.provide('tm.brains.Selfish');

tm.brains.Selfish = function(perception, memory) {
    var tile = perception.viewTile(0, 0);
    if(tile == tm.Tiles.PLANT) { return tm.Action.EAT; }
    if(this.energy > 7000) { return tm.Action.REPRODUCE; }
    var actionIndex = Math.floor(Math.random() * 6);
    return this.actions[actionIndex];
};
