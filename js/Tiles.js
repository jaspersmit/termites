
goog.provide('tm.Tiles');

tm.Tiles.NONE = 1;
tm.Tiles.PLANT = 2;
tm.Tiles.WEED = 4;
tm.Tiles.ENEMY = 8;
tm.Tiles.FRIEND = 16;
tm.Tiles.TERMITE = tm.Tiles.ENEMY | tm.Tiles.FRIEND;
