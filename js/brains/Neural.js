goog.provide('tm.brains.Neural');

goog.require('tm.Plant');

var tiles =               [
                        [0,-3],
                [-1,-2],[0,-2],[1,-2],
        [-2,-1],[-1,-1],[0,-1],[1,-1],[2,-1],
[-3, 0],[-2, 0],[-1, 0],[0, 0],[1, 0],[2, 0],[3, 0],
        [-2, 1],[-1, 1],[0, 1],[1, 1],[2, 1],
                [-1, 2],[0, 2],[1, 2],[2, 2],
                        [0, 3]
                          ];

var extraInputs = 1; //energy count
var tileTypeCount = 2;
var newBrain = function() {
    var inputs = tiles.length*tileTypeCount+extraInputs;
    var numActions = 7;
    var temporalWindow = 2;
    var networkSize = inputs*temporalWindow + numActions*temporalWindow + inputs;
    var neurons = 50;
    var learningRate = 0.001;
    var momentum = 0.0;

    var layer_defs = [];
    layer_defs.push({type:'input', out_sx:1, out_sy:1, out_depth:networkSize});
    layer_defs.push({type:'fc', num_neurons: neurons, activation:'relu'});
    layer_defs.push({type:'fc', num_neurons: neurons, activation:'relu'});
    layer_defs.push({type:'regression', num_neurons: numActions});

    // options for the Temporal Difference learner that trains the above net
    // by backpropping the temporal difference learning rule.
    var tdtrainer_options = {learning_rate:learningRate, momentum:momentum, batch_size:1, l2_decay:0.01};

    var opt = {};
    opt.temporal_window = temporalWindow;
    opt.experience_size = 30000; //size of replay memory
    opt.start_learn_threshold = 1000; //number of samples required in memory before we begin training
    opt.gamma = 0.7; //how much do we plan ahead
    opt.learning_steps_total = 2000000000; //how much training we'll do
    opt.learning_steps_burnin = 3000; //how many steps do we do random actions to have a good idea of what is possible
    opt.epsilon_min = 0.05; //after learning time: what is the epsilon we still have (random var)
    opt.epsilon_test_time = 0.05; //epsilon to use at training time
    opt.layer_defs = layer_defs;
    opt.tdtrainer_options = tdtrainer_options;
    return new deepqlearn.Brain(inputs, numActions, opt);
}

var brains = [ [4, 0, newBrain()],
               [3, 1, newBrain()],
               [2, 2, newBrain()],
               [1, 3, newBrain()] ];

var brainId = 0;
var sortBrainsByScore = function(a, b) {
    return b[0] - a[0];
}

tm.brains.Neural = function(perception, memory) {
    if (!('brain' in memory)) {
        memory.id = brainId++;
        memory.step = 0;
        memory.reward = 0;
        //choose a random brain to possibly make better
        var brain = Math.floor(Math.random()*4)
        memory.brain = newBrain();
        memory.brain.value_net.fromJSON(brains[brain][2].value_net.toJSON());
        console.log("Created brain " + memory.id + " using " + brain + " which lived for " + brains[brain][0]);
    }
    //insert our own brain if we lived longer than the worst one
    if (memory.step > brains[3][0]) {
        //try to find our own brain
        if (brains[0][1] == memory.id) {
            brains[0] = [memory.step, memory.id, memory.brain];
        } else if (brains[1][1] == memory.id) {
            brains[1] = [memory.step, memory.id, memory.brain];
        } else if (brains[2][1] == memory.id) {
            brains[2] = [memory.step, memory.id, memory.brain];
        } else {
            brains[3] = [memory.step, memory.id, memory.brain];
        }
        brains.sort(sortBrainsByScore);
    }
    var reward = 0;
    if ('energy' in memory && 'action' in memory) {
        if (action == tm.Action.REPRODUCE) {
            if (memory.energy < 4000) {
                reward = -1;
            } else {
                reward = 1;
            }
        } else {
            var energyDiff = perception.energy() - memory.energy;
            var totalEnergyScale = perception.energy() / 5000;
            //give extra rewards for high(er) energy
            if (energyDiff > 0) {
                reward = energyDiff/2300 * totalEnergyScale; //we want a max of 0.1
            } else {
                reward = energyDiff / 350; //max of -0.1
            }
        }
    } else {
        reward = -1; //punish for death
    }
    memory.brain.backward(reward);
    memory.reward += reward;
    memory.step++;
    if (memory.step % 1000 == 0) {
        console.log("reward for #" + perception.team() + ": " + memory.reward / 1000);
        console.log("best brain scores: " + brains[0][0] + "," + brains[1][0] + "," + brains[2][0] + "," + brains[3][0]);
        memory.reward = 0;
    }

    var inputs = new Uint8Array(inputs);
    var i = 0;
    for (var i = 0; i < tiles.length; i++) {
        var info = perception.viewTile(tiles[i][0], tiles[i][1]);
        if (info & (tm.Tiles.PLANT | tm.Tiles.WEED)) {
            inputs[i*tileTypeCount+extraInputs+0] = tm.Plant.getNutritionalValue(perception.viewData(tiles[i][0], tiles[i][1]));
        }
        if (info & tm.Tiles.FRIEND) {
            inputs[i*tileTypeCount+extraInputs+1] = 1;
        }
        if (info & tm.Tiles.ENEMY) {
            inputs[i*tileTypeCount+extraInputs+1] = -1;
        }
    }
    inputs[0] = perception.energy();
    var action = memory.brain.forward(inputs);
    memory.energy = perception.energy();
    memory.action = action;
    return action;
};
