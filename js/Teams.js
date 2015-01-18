goog.provide('tm.Teams');

goog.require('tm.brains.Random');

tm.Teams = [
    { team: 0, name: 'Red', color: 'red', brain: tm.brains.Random },
    { team: 1, name: 'Blue', color: 'blue', brain: tm.brains.Random }
];
