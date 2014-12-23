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

"use strict";

tm.reset = function() { 
    tm.World.reset();
    tm.WorldGenerator.generate(tm.World);
    tm.World.addTermite(
        new tm.Termite(tm.World, 0, 35, 25));
    tm.World.addTermite(
        new tm.Termite(tm.World, 1, 15, 25));
};
tm.start = function() {

    var fps = goog.dom.createDom('div');
    goog.dom.appendChild(document.body, fps);

    goog.dom.appendChild(document.body, goog.dom.createDom('span', {}, "speed"));
    var speed = goog.dom.createDom('input', { type:"number", min:1, max:1000, value: 10});
    goog.dom.appendChild(document.body, speed);

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
        for (var i=0; i<speed.value; i++) {
            simulator.simulate();
        }
        renderer.render();
        for(var i = 0; i < teamUIList.length; i++) {
            var teamPopulation = tm.World.population[i];
            teamUIList[i].setInfo(teamPopulation + "; " + Math.floor(simulator.getTeamEnergy(i) / teamPopulation) + " energy/termite");
        }
    }, 1);
    var lastTime = Date.now();
    var lastStep = 0;
    setInterval(function() {
        var now = Date.now();
        var step = simulator.getStep();
        fps.innerHTML = "FPS: " + Math.floor((step - lastStep) / (now - lastTime) * 1000);
        lastTime = now;
        lastStep = step;
    }, 1000);
};
