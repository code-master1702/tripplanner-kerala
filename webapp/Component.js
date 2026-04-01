sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/Device",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/resource/ResourceModel"
], function (UIComponent, Device, JSONModel, ResourceModel) {
    "use strict";

    return UIComponent.extend("com.roshan.tripplanner.Component", {

        metadata: {
            manifest: "json"
        },

        init: function () {
            UIComponent.prototype.init.apply(this, arguments);

            // Device model
            var oDeviceModel = new JSONModel(Device);
            oDeviceModel.setDefaultBindingMode("OneWay");
            this.setModel(oDeviceModel, "device");

            // Config model
            var oConfigModel = new JSONModel({
                selectedDuration: 3,
                selectedRoute: null,
                transportCost: 0,
                selectedStay: null,
                stayCostPerNight: 0,
                totalStayCost: 0,
                selectedLocalTransport: null,
                localTransportCostPerDay: 0,
                totalLocalTransportCost: 0,
                foodCostPerDay: 1000,
                totalFoodCost: 0,
                totalBudget: 0
            });
            this.setModel(oConfigModel, "config");

            // i18n model - load manually to ensure it works
            var sRootPath = sap.ui.require.toUrl("com/roshan/tripplanner");
            var oi18nModel = new ResourceModel({
                bundleUrl: sRootPath + "/i18n/i18n.properties"
            });
            this.setModel(oi18nModel, "i18n");

            // Initialize router
            this.getRouter().initialize();
        },

        getContentDensityClass: function () {
            if (this._sContentDensityClass === undefined) {
                if (document.body.classList.contains("sapUiSizeCozy") || document.body.classList.contains("sapUiSizeCompact")) {
                    this._sContentDensityClass = "";
                } else if (!Device.support.touch) {
                    this._sContentDensityClass = "sapUiSizeCompact";
                } else {
                    this._sContentDensityClass = "sapUiSizeCozy";
                }
            }
            return this._sContentDensityClass;
        }
    });
});