goog.provide('tm.start');

goog.require('goog.dom');
goog.require('tm.Renderer');
goog.require('tm.Simulator');
goog.require('tm.Termite');
goog.require('tm.World');
goog.require('tm.WorldGenerator');

tm.start = function() {
    var canvas = goog.dom.createDom('canvas', {'width': '500', 'height': '500'});
    goog.dom.appendChild(document.body, canvas);

    tm.WorldGenerator.generate(tm.World);

    tm.World.termites.push(new tm.Termite(tm.World, 0, 35, 25));
    tm.World.termites.push(new tm.Termite(tm.World, 1, 15, 25));

    var renderer = new tm.Renderer(canvas, tm.World);
    renderer.render();

    var simulator = new tm.Simulator(tm.World);
    setInterval(function() {
        simulator.simulate();
        renderer.render();
    }, 50);
};
