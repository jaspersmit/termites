goog.provide('tm.BrainRegistry');

goog.require('tm.brains.Random');
goog.require('tm.brains.Selfish');
goog.require('tm.brains.Greedy');
goog.require('tm.brains.Farming');
goog.require('tm.brains.Bastard');

tm.BrainRegistry = {
    random: {
        name: 'Random',
        brain: tm.brains.Random
    },

    selfish: {
        name: 'Selfish',
        brain: tm.brains.Selfish
    },

    greedy: {
        name: 'Greedy',
        brain: tm.brains.Greedy
    },

    farming: {
        name: 'Farming',
        brain: tm.brains.Farming
    },

    bastard: {
        name: 'Bastard',
        brain: tm.brains.Bastard
    }
};
