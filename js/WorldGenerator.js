goog.provide('tm.WorldGenerator');

goog.require('tm.World')
goog.require('tm.Tiles')

tm.WorldGenerator = {
    generate: function(world) {
        for(var x = 0; x < world.size; x++) {
            for(var y = 0; y < world.size; y++) {
                if(Math.random() < 0.75) { 
                    world.setTile(x, y, tm.Tiles.PLANT);
                } else {
                    world.setTile(x, y, tm.Tiles.WEED);
                }
            }
        }

        var simulator = new tm.Simulator(world);
        for(var i = 0; i < 1000; i++) {
            simulator.simulate();
        }

    }
};
