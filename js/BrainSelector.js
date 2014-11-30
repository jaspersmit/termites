goog.provide('tm.BrainSelector');

goog.require('goog.dom');
goog.require('tm.BrainRegistry');

tm.BrainSelector = function(id, container) {
    this.container = container;
    this.label = goog.dom.createDom('label', {'for': id}, 'Brain: ');
    this.select = goog.dom.createDom('select', {'id': id});

    for(var brain in tm.BrainRegistry) {
        if(tm.BrainRegistry.hasOwnProperty(brain)) {
            var brainInfo = tm.BrainRegistry[brain];
            var option = goog.dom.createDom('option', {'value': brain}, brainInfo.name);
            goog.dom.appendChild(this.select, option);
        }
    }

    goog.dom.appendChild(this.container, this.label);
    goog.dom.appendChild(this.container, this.select);
};
