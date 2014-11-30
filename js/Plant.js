goog.provide('tm.Plant');

tm.Plant = {
    nutritionalValues: [25, 50, 75, 100, 125],
    getNutritionalValue: function(data) {
        return this.nutritionalValues[data];
    }
};
