sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Sorter",
    "sap/ui/model/json/JSONModel"
], function (Controller, MessageToast, MessageBox, Filter, FilterOperator, Sorter, JSONModel) {
    "use strict";

    return Controller.extend("com.roshan.tripplanner.controller.TestOData", {

        onInit: function () {
            // Load products via fetch (works in BAS without CORS issues)
            var sUrl = "https://services.odata.org/V2/Northwind/Northwind.svc/Products?$format=json&$select=ProductID,ProductName,UnitPrice,UnitsInStock,CategoryID&$top=50";
            var that = this;

            // Create empty model first
            var oProductsModel = new JSONModel({ results: [] });
            this.getView().setModel(oProductsModel, "products");

            // Fetch data
            fetch(sUrl)
                .then(function (response) {
                    if (!response.ok) {
                        throw new Error("HTTP " + response.status);
                    }
                    return response.json();
                })
                .then(function (oData) {
                    oProductsModel.setData({ results: oData.d.results });
                    MessageToast.show("Loaded " + oData.d.results.length + " products!");
                })
                .catch(function (oError) {
                    MessageBox.warning(
                        "Could not load Northwind data.\n\n" +
                        "Reason: BAS blocks cross-origin requests (CORS).\n\n" +
                        "To fix this:\n" +
                        "1. Create a BTP Destination for Northwind\n" +
                        "2. Or use ui5-middleware-simpleproxy\n" +
                        "3. Or test locally (not in BAS)\n\n" +
                        "See OData_Integration_Guide.md for details.",
                        { title: "OData Connection Issue" }
                    );
                    console.error("OData fetch error:", oError);
                });
        },

        onNavBack: function () {
            this.getOwnerComponent().getRouter().navTo("RouteRoutes");
        },

        onFilterProducts: function () {
            var aFilters = [];

            var sQuery = this.byId("productSearch").getValue().trim();
            if (sQuery) {
                aFilters.push(new Filter("ProductName", FilterOperator.Contains, sQuery));
            }

            var sCategoryKey = this.byId("categoryFilter").getSelectedKey();
            if (sCategoryKey) {
                aFilters.push(new Filter("CategoryID", FilterOperator.EQ, parseInt(sCategoryKey)));
            }

            var oCombinedFilter = null;
            if (aFilters.length > 0) {
                oCombinedFilter = new Filter({ filters: aFilters, and: true });
            }

            var oTable = this.byId("productsTable");
            var oBinding = oTable.getBinding("items");
            if (oBinding) {
                oBinding.filter(oCombinedFilter ? [oCombinedFilter] : []);
            }
        },

        onSortByPrice: function () {
            var oBinding = this.byId("productsTable").getBinding("items");
            if (oBinding) {
                oBinding.sort([new Sorter("UnitPrice", false)]);
                MessageToast.show("Sorted by price");
            }
        },

        onGroupByCategory: function () {
            var oBinding = this.byId("productsTable").getBinding("items");
            if (oBinding) {
                var oSorter = new Sorter("CategoryID", false, function (oContext) {
                    var id = oContext.getProperty("CategoryID");
                    return { key: id, text: "Category " + id };
                });
                oBinding.sort([oSorter]);
                MessageToast.show("Grouped by category");
            }
        },

        onResetSort: function () {
            var oBinding = this.byId("productsTable").getBinding("items");
            if (oBinding) {
                oBinding.sort([]);
                oBinding.filter([]);
                MessageToast.show("Reset done");
            }
        },

        onTableUpdateFinished: function (oEvent) {
            var iTotal = oEvent.getParameter("total");
            this.byId("productCount").setText(iTotal + " products");
        }
    });
});