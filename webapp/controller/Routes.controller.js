sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
], function (Controller, MessageToast) {
    "use strict";

    return Controller.extend("com.roshan.tripplanner.controller.Routes", {

        onInit: function () {
            // Recalculate budget every time user comes back to this page
            this.getOwnerComponent().getRouter()
                .getRoute("RouteRoutes")
                .attachPatternMatched(this._onRouteMatched, this);
        },

        _onRouteMatched: function () {
            // Recalculate in case user changed stay/transport on other pages
            this._computeBudget();
        },

        onDurationChange: function (oEvent) {
            var sKey = oEvent.getParameter("item").getKey();
            var iDuration = parseInt(sKey, 10);
            this.getOwnerComponent().getModel("config").setProperty("/selectedDuration", iDuration);
            this._computeBudget();
            MessageToast.show("Duration: " + iDuration + " days");
        },

        onRouteSelect: function (oEvent) {
            var oSelectedItem = oEvent.getParameter("listItem");
            var oContext = oSelectedItem.getBindingContext("routes");
            var oRoute = oContext.getObject();
            var oConfigModel = this.getOwnerComponent().getModel("config");
            oConfigModel.setProperty("/selectedRoute", oRoute);
            oConfigModel.setProperty("/transportCost", oRoute.baseCost);
            this._computeBudget();
            MessageToast.show("Selected: " + oRoute.type + " (₹" + oRoute.baseCost + ")");
        },

        /**
         * Central Budget Calculator
         * Calculates total from ALL selections across pages:
         * - Transport (from this page)
         * - Stay (from Stays page)
         * - Local Transport (from Stays page)
         * - Food (auto-estimated)
         */
        _computeBudget: function () {
            var oConfigModel = this.getOwnerComponent().getModel("config");
            var iDuration = oConfigModel.getProperty("/selectedDuration") || 3;

            // Transport cost (one-time)
            var iTransportCost = oConfigModel.getProperty("/transportCost") || 0;

            // Stay cost (per night × duration)
            var iStayCostPerNight = oConfigModel.getProperty("/stayCostPerNight") || 0;
            var iTotalStayCost = iStayCostPerNight * iDuration;
            oConfigModel.setProperty("/totalStayCost", iTotalStayCost);

            // Local transport cost (per day × duration)
            var iLocalTransportPerDay = oConfigModel.getProperty("/localTransportCostPerDay") || 0;
            var iTotalLocalTransport = iLocalTransportPerDay * iDuration;
            oConfigModel.setProperty("/totalLocalTransportCost", iTotalLocalTransport);

            // Food cost (auto-estimated ₹1000/day)
            var iFoodPerDay = oConfigModel.getProperty("/foodCostPerDay") || 1000;
            var iTotalFood = iFoodPerDay * iDuration;
            oConfigModel.setProperty("/totalFoodCost", iTotalFood);

            // Grand total
            var iTotal = iTransportCost + iTotalStayCost + iTotalLocalTransport + iTotalFood;
            oConfigModel.setProperty("/totalBudget", iTotal);
        },

        onNavigateToPlaces: function () {
            this.getOwnerComponent().getRouter().navTo("RoutePlace");
        },

        onNavigateToStays: function () {
            this.getOwnerComponent().getRouter().navTo("RouteStays");
        },

        onNavigateToOData: function () {
            this.getOwnerComponent().getRouter().navTo("RouteTestOData");
        }
    });
});