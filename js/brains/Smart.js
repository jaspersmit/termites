goog.provide('tm.brains.Smart');

goog.require('tm.Tiles');
goog.require('tm.Action');


tm.Network = function() {
    this.inputNodes = [];
    this.innerNodes = [];
    this.outputNodes = [];
    this.nodeCount = 0;
};
tm.Network.prototype = {
    run: function(perception, memory) {
        for(var i = 0; i < this.inputNodes.length; i++) {
           this.inputNodes[i].run(perception, memory); 
        }
        for(var i = 0; i < this.innerNodes.length; i++) {
           this.innerNodes[i].run(); 
        }
        for(var i = 0; i < this.outputNodes.length; i++) {
           this.outputNodes[i].run(); 
        }
        var maxValue = -1000;
        var action = tm.Action.EAT;
        for(var i = 0; i < this.outputNodes.length; i++) {
           var node = this.outputNodes[i];
           if(node.value > maxValue) {
               maxValue = node.value;
               action = node.action;
           }
        }
        return action;
    },

    addInputNode: function(node) {
        node.id = this.inputNodes.length + this.innerNodes.length + this.outputNodes.length;
        this.inputNodes.push(node);
    },

    addInnerNode: function(node) {
        node.id = this.inputNodes.length + this.innerNodes.length + this.outputNodes.length;
        this.innerNodes.push(node);
    },

    addOutputNode: function(node) {
        node.id = this.inputNodes.length + this.innerNodes.length + this.outputNodes.length;
        this.outputNodes.push(node);
    },

    addLink: function(from, to, strength) {
        var link = new tm.Link(strength, from, to);
        from.addOutput(link);
        to.addInput(link);
    },

    getNodeById: function(id) {
        if(id < this.inputNodes.length) {
            return this.inputNodes[id];
        }
        id -= this.inputNodes.length;
        if(id < this.innerNodes.length) {
            return this.innerNodes[id];
        }
        id -= this.innerNodes.length;
        return this.outputNodes[id];
    },
    
    assignNodeIds: function() {
        var id = 0;
        for(var i = 0; i < this.inputNodes.length; i++) {
            this.inputNodes[i].id = id++;
        }
        for(var i = 0; i < this.innerNodes.length; i++) {
            this.innerNodes[i].id = id++;
        }
        for(var i = 0; i < this.outputNodes.length; i++) {
            this.outputNodes[i].id = id++;
        }
    },

    clone: function() {
        this.assignNodeIds();
        var copy = new tm.Network();
        for(var i = 0; i < this.inputNodes.length; i++) {
            var node = this.inputNodes[i].clone();
            copy.addInputNode(node);
        }
        for(var i = 0; i < this.innerNodes.length; i++) {
            var node = this.innerNodes[i].clone();
            copy.addInnerNode(node);
        }
        for(var i = 0; i < this.outputNodes.length; i++) {
            var node = this.outputNodes[i].clone();
            copy.addOutputNode(node);
        }

        var allNodes = this.inputNodes.concat(this.innerNodes).concat(this.outputNodes);
        for(var i = 0; i < allNodes.length; i++) {
            var from = allNodes[i];
            for(var j = 0; j < from.outputs.length; j++) {
                var link = from.outputs[j];
                var to = link.to;
                copy.addLink(copy.getNodeById(from.id), copy.getNodeById(to.id), link.strength);
            }
        }
        return copy;
    }
};

tm.Node = function() {
    this.inputs = [];
    this.outputs = [];
};

tm.Node.prototype.addInput =
function(link) {
    this.inputs.push(link);
};

tm.Node.prototype.addOutput =
function(link) {
    this.outputs.push(link);
};

tm.Node.prototype.clone =
function() {
    return new tm.Node();
}

tm.EnergyNode = function() {
    goog.base(this);
};
goog.inherits(tm.EnergyNode, tm.Node);

tm.EnergyNode.prototype.run =
function(perception, memory) {
    var value = perception.energy() / 10000;
    for(var i = 0; i < this.outputs.length; i++) {
        this.outputs[i].output(value);
    }
};

tm.EnergyNode.prototype.clone =
function() {
    return new tm.EnergyNode();
};

tm.RandomNode = function() {
    tm.Node.call(this);
};
goog.inherits(tm.RandomNode, tm.Node);

tm.RandomNode.prototype.run =
function(perception, memory) {
    var value = Math.random();
    for(var i = 0; i < this.outputs.length; i++) {
        this.outputs[i].output(value);
    }
};

tm.RandomNode.prototype.clone =
function() {
    return new tm.RandomNode();
};

tm.DetectPlantNode = function(x, y) {
    goog.base(this);
    this.x = x;
    this.y = y;
};
goog.inherits(tm.DetectPlantNode, tm.Node);

tm.DetectPlantNode.prototype.run =
function(perception, memory) {
    var tile = perception.viewTile(this.x, this.y);
    var value = 0;
    if(tile == tm.Tiles.PLANT) {
        var data = perception.viewData(this.x, this.y);
        value = data / 4;
    }
    for(var i = 0; i < this.outputs.length; i++) {
        this.outputs[i].output(value);
    }
};

tm.DetectPlantNode.prototype.clone = 
function() {
    return new tm.DetectPlantNode(this.x, this.y);
};

tm.DetectWeedNode = function(x, y) {
    goog.base(this);
    this.x = x;
    this.y = y;
};
goog.inherits(tm.DetectWeedNode, tm.Node);

tm.DetectWeedNode.prototype.run =
function(perception, memory) {
    var tile = perception.viewTile(this.x, this.y);
    var value = 0;
    if(tile == tm.Tiles.WEED) {
        var data = perception.viewData(this.x, this.y);
        value = data / 4;
    }
    for(var i = 0; i < this.outputs.length; i++) {
        this.outputs[i].output(value);
    }
};

tm.DetectWeedNode.prototype.clone =
function() {
   return new tm.DetectWeedNode(this.x, this.y); 
};

tm.InnerNode = function() {
    this.value = 0;
    goog.base(this);
};
goog.inherits(tm.InnerNode, tm.Node);

tm.InnerNode.prototype.run = 
function() {
    this.value = 0;
    for(var i = 0; i < this.inputs.length; i++) {
        this.value += this.inputs[i].value;
    }
    for(var i = 0; i < this.outputs.length; i++) {
        this.outputs[i].output(this.value);
    }
};

tm.InnerNode.prototype.clone =
function() {
    return new tm.InnerNode();
};

tm.ActionNode = function(action) {
    goog.base(this);
    this.action = action;
    this.value = 0; 
};
goog.inherits(tm.ActionNode, tm.InnerNode);

tm.ActionNode.prototype.clone =
function() {
    return new tm.ActionNode(this.action);
};

tm.Link = function(strength, from, to) {
    this.value = 0;
    this.strength = strength;
    this.from = from;
    this.to = to;
};
tm.Link.prototype = {
    output: function(value) {
        this.value = this.strength * value;
    }
};

initBasicNetwork = function() {
    var actions = [tm.Action.UP, tm.Action.DOWN, tm.Action.RIGHT, tm.Action.LEFT];

    var network = new tm.Network();
    for(var i in actions) {
        var actionNode = new tm.ActionNode(actions[i]);
        network.addOutputNode(actionNode);
        var randomNode = new tm.RandomNode();
        network.addInputNode(randomNode);
        network.addLink(randomNode, actionNode, 0.5);
    }

    var plantDetector = new tm.DetectPlantNode(0, 0);
    network.addInputNode(plantDetector);
    var eatAction = new tm.ActionNode(tm.Action.EAT);
    network.addOutputNode(eatAction);
    network.addLink(plantDetector, eatAction, 2);

    var weedDetector = new tm.DetectWeedNode(0, 0);
    network.addInputNode(weedDetector);
    network.addLink(weedDetector, eatAction, 0.95);

    var energyNode = new tm.EnergyNode();
    network.addInputNode(energyNode);
    var reproduceNode = new tm.ActionNode(tm.Action.REPRODUCE);
    network.addOutputNode(reproduceNode);
    network.addLink(energyNode, reproduceNode, 0.4);

    return network;
}

basicNetwork = initBasicNetwork();


tm.brains.Smart = function(perception, memory, dna) {
    if(!dna.network) {
        dna.network = initBasicNetwork();
    }
    return dna.network.run(perception, memory);
};

tm.brains.Smart.mutate = function(dna) {
    var network = dna.network.clone();
    mutateWeights(network);

    var numLinks = 0;
    for(var i = 0; i < network.inputNodes.length; i++) {
        numLinks += network.inputNodes[i].outputs.length;
    }
    for(var i = 0; i < network.inputNodes.length; i++) {
        numLinks += network.innerNodes[i].outputs.length;
    }
    var linkGrowFactor = (numLinks / 20000) - 0.5;
    
    createNewLinks(network, linkGrowFactor);
    removeLinks(network, linkGrowFactor);
    //createNodes(network, node
    
    removeNodes();
    
    
    return { network: network };
};

function mutateWeights(network) {
    var mutateRate = 0.05;
    var nodes = network.inputNodes.concat(network.innerNodes).concat(network.outputNodes);
    for(var i = 0; i < nodes.length; i++) {
        var node = nodes[i];
        for(var j = 0; j < node.outputs.length; j++) {
            var link = node.outputs[j];
            var mutatePart = mutateRate * Math.random() * link.strength;
            var mutate = mutatePart;
            while(Math.random() < 0.5) {
                mutate = mutate + mutatePart;
            }
            if(Math.random() < 0.5) {
                link.strenth -= mutate;
            } else {
                link.strenth += mutate;
            }
        }
    }
};

function isPathBetween(node1, node2) {
    if(node1 == node2) { return true; }
    for(var i = 0; i < node1.outputs.length; i++) {
        var other = node1.outputs[i].to;
        if(isPathBetween(other, node2)) { return true; }
    }
    return false;
}

function createNewLink(network, growFactor) {
    var node1 = getRandomNode(network); 
    var node2 = getRandomNode(network);

    if(isPathBetween(node1, node2)) { return false; }
}

function createNewLinks(network, growFactor) {
    var linksCreated = 0;

    while(createNewLink(network)) {
        linksCreated ++;
    }
    console.info(linksCreated + " new links created");

}
