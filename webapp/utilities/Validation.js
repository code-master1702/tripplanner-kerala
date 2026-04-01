sap.ui.define([], function () {
    "use strict";

    return {

        /**
         * CONCEPT 3: Validation - Cost Check
         * Returns ValueState string based on cost thresholds
         * Similar to course example: weightMeasure > 5 returns true/false
         */
        validateCost: function (baseCost) {
            if (!baseCost && baseCost !== 0) {
                return "None";
            }
            var num = parseFloat(baseCost);
            if (num > 5000) {
                return "Error";     // Red - expensive
            } else if (num > 2000) {
                return "Warning";   // Orange - moderate
            }
            return "Success";       // Green - affordable
        },

        /**
         * CONCEPT 3: Validation - Rating Check
         * Returns true if rating is good (>= 4.0)
         */
        isGoodRating: function (rating) {
            return parseFloat(rating) >= 4.0;
        },

        /**
         * CONCEPT 3: Validation - Budget Status Text
         */
        getBudgetStatus: function (totalBudget) {
            if (!totalBudget || totalBudget === 0) {
                return "";
            }
            var num = parseFloat(totalBudget);
            if (num > 15000) {
                return "Over Budget!";
            } else if (num > 10000) {
                return "Moderate Budget";
            }
            return "Within Budget ✅";
        }
    };
});