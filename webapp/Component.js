/**
 * eslint-disable @sap/ui5-jsdocs/no-jsdoc
 */

sap.ui.define(
	[
		"sap/ui/core/UIComponent",
		"sap/ui/Device",
		"com/candentech/sowtracker/model/models",
		"sap/ui/model/json/JSONModel",
	],
	function (UIComponent, Device, models, JSONModel) {
		"use strict";

		return UIComponent.extend("com.candentech.sowtracker.Component", {
			metadata: {
				manifest: "json",
			},

			/**
			 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
			 * @public
			 * @override
			 */
			init: function () {
				// call the base component's init function
				UIComponent.prototype.init.apply(this, arguments);

				// enable routing
				this.getRouter().initialize();

				// set the device model
				this.setModel(models.createDeviceModel(), "device");

				fetch("/sow_candent_api/agreementdetails")
					.then((res) => res.json())
					.then((data) => {
						console.log(data);
						this.setModel(new JSONModel(data), "products");
					})
					.catch(console.error);
			},
		});
	}
);
