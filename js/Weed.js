goog.provide('tm.Weed');

tm.Weed = {
    nutritionalValues: [-10, -20, -30, -40, -50],
    getNutritionalValue: function(data) {
        return this.nutritionalValues[data];
    }
};
