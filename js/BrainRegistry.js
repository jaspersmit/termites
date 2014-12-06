goog.provide('tm.BrainRegistry');

goog.require('tm.brains.RandomBrain');
goog.require('tm.brains.SelfishBrain');
goog.require('tm.brains.GreedyBrain');
goog.require('tm.brains.FarmingBrain');
goog.require('tm.brains.Bastard');

tm.BrainRegistry = {
    randomBrain: {
        name: 'Random brain',
        brain: tm.brains.RandomBrain
    },

    selfishBrain: {
        name: 'Selfish Brain',
        brain: tm.brains.SelfishBrain
    },

    greedyBrain: {
        name: 'Greedy Brain',
        brain: tm.brains.GreedyBrain
    },

    farmingBrain: {
        name: 'Farming Brain',
        brain: tm.brains.FarmingBrain
    },

    bastard: {
        name: 'Bastard',
        brain: tm.brains.Bastard
    }
};
