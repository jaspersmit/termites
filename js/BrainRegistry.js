goog.provide('tm.BrainRegistry');

goog.require('tm.brains.RandomBrain');
goog.require('tm.brains.SelfishBrain');

tm.BrainRegistry = {
    randomBrain: {
        name: 'Random brain',
        brain: tm.brains.RandomBrain
    },

    selfishBrain: {
        name: 'Selfish Brain',
        brain: tm.brains.SelfishBrain
    }
};
