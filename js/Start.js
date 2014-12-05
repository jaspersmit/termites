goog.provide('tm.start');

goog.require('goog.dom');
goog.require('tm.BrainSelector');
goog.require('tm.Renderer');
goog.require('tm.Simulator');
goog.require('tm.Termite');
goog.require('tm.World');
goog.require('tm.WorldGenerator');
goog.require('tm.TeamUI');
goog.require('tm.Teams');

tm.reset = function() { 
    tm.WorldGenerator.generate(tm.World);

    tm.World.termites = [
        new tm.Termite(tm.World, 0, 35, 25),
        new tm.Termite(tm.World, 1, 15, 25) ];
};
tm.start = function() {

    var createTeamDiv = function(teamInfo) {
        var teamDiv = goog.dom.createDom('div');
        goog.dom.appendChild(document.body, teamDiv);
        return new tm.TeamUI(teamInfo, teamDiv);
    };
    var teamUIList = [];
    for(var i = 0; i < tm.Teams.length; i++) {
        var teamUI = createTeamDiv(tm.Teams[i]);
        teamUIList.push(teamUI);
    }

    tm.reset();

    var canvas = goog.dom.createDom('canvas', {'width': '500', 'height': '500'});
    goog.dom.appendChild(document.body, canvas);

    var renderer = new tm.Renderer(canvas, tm.World);
    renderer.render();

    var simulator = new tm.Simulator(tm.World);
    setInterval(function() {
        simulator.simulate();
        renderer.render();
        for(var i = 0; i < teamUIList.length; i++) {
            teamUIList[i].setPopulation(simulator.getTeamPopulation(i));
        }
    }, 1);
};
