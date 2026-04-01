sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Sorter",
    "sap/m/MessageToast"
], function (Controller, Filter, FilterOperator, Sorter, MessageToast) {
    "use strict";

    return Controller.extend("com.roshan.tripplanner.controller.Stays", {

        onInit: function () {
            this._fRatingValue = null;
            this._sCategoryKey = "";
        },

        onNavBack: function () {
            this.getOwnerComponent().getRouter().navTo("RouteRoutes");
        },

        /**
         * User selects a STAY — update config model
         */
        onStaySelect: function (oEvent) {
            var oSelectedItem = oEvent.getParameter("listItem");
            var oContext = oSelectedItem.getBindingContext("stays");
            var oStay = oContext.getObject();

            var oConfigModel = this.getOwnerComponent().getModel("config");
            oConfigModel.setProperty("/selectedStay", oStay);
            oConfigModel.setProperty("/stayCostPerNight", oStay.avgCostPerNight);

            this._computeBudget();
            MessageToast.show("Stay: " + oStay.type + " (₹" + oStay.avgCostPerNight + "/night)");
        },

        /**
         * User selects a LOCAL TRANSPORT — update config model
         */
        onLocalTransportSelect: function (oEvent) {
            var oSelectedItem = oEvent.getParameter("listItem");
            var oContext = oSelectedItem.getBindingContext("stays");
            var oTransport = oContext.getObject();

            var oConfigModel = this.getOwnerComponent().getModel("config");
            oConfigModel.setProperty("/selectedLocalTransport", oTransport);
            oConfigModel.setProperty("/localTransportCostPerDay", oTransport.avgCostPerDay);

            this._computeBudget();
            MessageToast.show("Transport: " + oTransport.mode + " (₹" + oTransport.avgCostPerDay + "/day)");
        },

        /**
         * Recalculate total budget from all selections
         */
        _computeBudget: function () {
            var oConfigModel = this.getOwnerComponent().getModel("config");
            var iDuration = oConfigModel.getProperty("/selectedDuration") || 3;

            var iTransportCost = oConfigModel.getProperty("/transportCost") || 0;

            var iStayCostPerNight = oConfigModel.getProperty("/stayCostPerNight") || 0;
            var iTotalStayCost = iStayCostPerNight * iDuration;
            oConfigModel.setProperty("/totalStayCost", iTotalStayCost);

            var iLocalTransportPerDay = oConfigModel.getProperty("/localTransportCostPerDay") || 0;
            var iTotalLocalTransport = iLocalTransportPerDay * iDuration;
            oConfigModel.setProperty("/totalLocalTransportCost", iTotalLocalTransport);

            var iFoodPerDay = oConfigModel.getProperty("/foodCostPerDay") || 1000;
            var iTotalFood = iFoodPerDay * iDuration;
            oConfigModel.setProperty("/totalFoodCost", iTotalFood);

            var iTotal = iTransportCost + iTotalStayCost + iTotalLocalTransport + iTotalFood;
            oConfigModel.setProperty("/totalBudget", iTotal);
        },

        // --- FILTERS ---

        onSearchRating: function (oEvent) {
            var sValue = oEvent.getParameter("newValue").trim();
            this._fRatingValue = sValue ? parseFloat(sValue) : null;
            this._applyFilters();
        },

        onFilterByCategory: function (oEvent) {
            this._sCategoryKey = oEvent.getParameter("selectedItem").getKey();
            this._applyFilters();
        },

        _applyFilters: function () {
            var aFilters = [];

            if (this._fRatingValue !== null && !isNaN(this._fRatingValue)) {
                var fRating = this._fRatingValue;
                if (fRating >= 1 && fRating <= 5) {
                    if (fRating === 5) {
                        aFilters.push(new Filter("rating", FilterOperator.EQ, 5));
                    } else {
                        aFilters.push(new Filter("rating", FilterOperator.BT, fRating, Math.min(fRating + 0.99, 5)));
                    }
                }
            }

            if (this._sCategoryKey) {
                aFilters.push(new Filter("category", FilterOperator.EQ, this._sCategoryKey));
            }

            var oCombinedFilter = null;
            if (aFilters.length > 0) {
                oCombinedFilter = new Filter({ filters: aFilters, and: true });
            }

            var oList = this.byId("staysList");
            oList.getBinding("items").filter(oCombinedFilter ? [oCombinedFilter] : []);
        }
    });
});