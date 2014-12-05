goog.provide('tm.TeamUI');

goog.require('goog.dom');
goog.require('tm.BrainSelector');

tm.TeamUI = function(teamInfo, container) {
   var colorIndicator = goog.dom.createDom('div', { style: 'display: inline-block; width: 20px; height: 16px; border: 1px solid black; background: ' + teamInfo.color});
   goog.dom.appendChild(container, colorIndicator);
   var brainSelector = new tm.BrainSelector(teamInfo, container);
   var teamUI = this;
   this.population = goog.dom.createDom('span', {}, '0');
   goog.dom.appendChild(container, this.population);
};
tm.TeamUI.prototype = {
    setPopulation: function(population) {
        this.population.innerHTML = population;
    }, 

    brainSelected: function() { } 
};
