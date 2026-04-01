sap.ui.define([
    "sap/ui/core/ComponentContainer"
], function (ComponentContainer) {
    "use strict";

    new ComponentContainer({
        name: "com.roshan.tripplanner",
        settings: {},
        async: true
    }).placeAt("content");
});