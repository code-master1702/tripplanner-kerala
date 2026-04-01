sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Sorter",
    "sap/m/MessageToast",
    "sap/m/MessageBox"
], function (Controller, Filter, FilterOperator, Sorter, MessageToast, MessageBox) {
    "use strict";

    /**
     * CONCEPTS USED:
     * 1. Custom Formatters via core:require
     * 2. Multiple Filters (search + season dropdown) with AND logic
     * 3. Sorter with grouping by region
     * 4. List count update on filter
     */

    return Controller.extend("com.roshan.tripplanner.controller.Place", {

        onInit: function () {
            // Store current filters for combining
            this._sSearchQuery = "";
            this._sSeasonKey = "";
        },

        onNavBack: function () {
            this.getOwnerComponent().getRouter().navTo("RouteRoutes");
        },

        /**
         * CONCEPT 4: Live search filter on places
         * Searches across city, mustVisit, localItems fields
         */
        onSearchPlaces: function (oEvent) {
            this._sSearchQuery = oEvent.getParameter("newValue").trim();
            this._applyFilters();
        },

        /**
         * CONCEPT 4: Filter by season dropdown
         */
        onFilterBySeason: function (oEvent) {
            this._sSeasonKey = oEvent.getParameter("selectedItem").getKey();
            this._applyFilters();
        },

        /**
         * CONCEPT 4: Combine multiple filters with AND logic
         */
        _applyFilters: function () {
            var aFilters = [];

            // Search filter — search across multiple fields with OR
            if (this._sSearchQuery) {
                var aSearchFilters = [
                    new Filter("city", FilterOperator.Contains, this._sSearchQuery),
                    new Filter("mustVisit", FilterOperator.Contains, this._sSearchQuery),
                    new Filter("localItems", FilterOperator.Contains, this._sSearchQuery),
                    new Filter("bestSeason", FilterOperator.Contains, this._sSearchQuery)
                ];
                aFilters.push(new Filter({
                    filters: aSearchFilters,
                    and: false  // OR — match any field
                }));
            }

            // Season filter
            if (this._sSeasonKey) {
                aFilters.push(new Filter("bestSeason", FilterOperator.Contains, this._sSeasonKey));
            }

            // Combine all with AND logic
            var oCombinedFilter = null;
            if (aFilters.length > 0) {
                oCombinedFilter = new Filter({
                    filters: aFilters,
                    and: true   // AND — all conditions must match
                });
            }

            var oList = this.byId("placesList");
            var oBinding = oList.getBinding("items");
            oBinding.filter(oCombinedFilter ? [oCombinedFilter] : []);
        },

        /**
         * CONCEPT 5: Sort by popularity (descending)
         */
        onSortByPopularity: function () {
            var oList = this.byId("placesList");
            var oBinding = oList.getBinding("items");
            var oSorter = new Sorter("popularity", true); // true = descending
            oBinding.sort([oSorter]);
            MessageToast.show("Sorted by popularity");
        },

        /**
         * CONCEPT 5: Group by region
         */
        onGroupByRegion: function () {
            var oList = this.byId("placesList");
            var oBinding = oList.getBinding("items");
            var oSorter = new Sorter("region", false, function (oContext) {
                var sRegion = oContext.getProperty("region");
                return {
                    key: sRegion,
                    text: "🌍 Region: " + sRegion
                };
            });
            oBinding.sort([oSorter]);
            MessageToast.show("Grouped by region");
        },

        /**
         * Reset all sorting
         */
        onResetSort: function () {
            var oList = this.byId("placesList");
            var oBinding = oList.getBinding("items");
            oBinding.sort([]);
            MessageToast.show("Sort reset");
        },

        /**
         * Update list item count label
         */
        onListUpdateFinished: function (oEvent) {
            var iTotal = oEvent.getParameter("total");
            this.byId("placeCount").setText(iTotal + " places found");
        },

        /**
         * Handle place item press — show detail dialog
         */
        onPlacePress: function (oEvent) {
            var oContext = oEvent.getSource().getBindingContext("places");
            var oPlace = oContext.getObject();

            MessageBox.information(
                "📍 City: " + oPlace.city + "\n\n" +
                "🏖️ Must Visit: " + oPlace.mustVisit + "\n\n" +
                "🍛 Local Food: " + oPlace.localItems + "\n\n" +
                "📅 Best Months: " + oPlace.bestMonths + "\n\n" +
                "⏱ Days Needed: " + oPlace.daysNeeded,
                {
                    title: oPlace.city + " — Travel Guide"
                }
            );
        }
    });
});