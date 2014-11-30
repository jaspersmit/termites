goog.provide('tm.BrainRegistry');

goog.require('tm.brain.RandomBrain');
goog.require('tm.brain.SelfishBrain');

tm.BrainRegistry = {
    randomBrain: {
        name: 'Random brain',
        brain: tm.brain.RandomBrain
    },

    selfishBrain: {
        name: 'Selfish Brain',
        brain: tm.brain.SelfishBrain
    }
};
