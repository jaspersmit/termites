goog.provide('tm.Teams');

goog.require('tm.brains.RandomBrain');

tm.Teams = [
    { team: 0, name: 'Red', color: 'red', brain: tm.brains.RandomBrain },
    { team: 1, name: 'Blue', color: 'blue', brain: tm.brains.RandomBrain }
];
