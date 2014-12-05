goog.provide('tm.BrainSelector');

goog.require('goog.dom');
goog.require('tm.BrainRegistry');
goog.require('tm.Teams');
goog.require('tm.World');
goog.require('tm.WorldGenerator');
goog.require('goog.events');
goog.require('goog.dom.forms');

tm.BrainSelector = function(teamInfo, container) {
    this.container = container;
    this.label = goog.dom.createDom('label', {}, 'Brain: ');
    this.select = goog.dom.createDom('select');

    for(var brain in tm.BrainRegistry) {
        if(tm.BrainRegistry.hasOwnProperty(brain)) {
            var brainInfo = tm.BrainRegistry[brain];
            var option = goog.dom.createDom('option', {'value': brain}, brainInfo.name);
            goog.dom.appendChild(this.select, option);
        }
    }

    goog.dom.appendChild(this.container, this.label);
    goog.dom.appendChild(this.container, this.select);

    goog.events.listen(this.select, goog.events.EventType.CHANGE, function() { 
        var brain = goog.dom.forms.getValue(this.select);
        tm.Teams[teamInfo.team].brain = tm.BrainRegistry[brain].brain;
        tm.reset();
    
    }, false, this);
};

