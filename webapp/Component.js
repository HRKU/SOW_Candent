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
				// sap.ui.core.BusyIndicator.show();
				// call the base component's init function
				UIComponent.prototype.init.apply(this, arguments);

				// enable routing
				this.getRouter().initialize();

				// set the device model
				this.setModel(models.createDeviceModel(), "device");
				// this.getRouter().attachBeforeRouteMatched(
				// 	this.onBeforeRouteMatched,
				// 	this
				// );

				// fetch("http://yw:8000/sow_candent_api/agreements/list")
				fetch("http://excavator:8000/sow_candent_api/agreements/list")
					.then((res) => res.json())
					.then((data) => {
						console.log(data);
						var oModel = {};
						oModel.agreements = {};
						oModel.agreements = data;
						oModel.filtered = {};
						oModel.filtered.All = oModel.agreements;
						oModel.filtered.MSA = oModel.agreements.filter(
							(i) => i.Type == "MSA"
						);
						oModel.filtered.SOW = oModel.agreements.filter(
							(i) => i.Type == "SOW"
						);
						oModel.filtered.NDA = oModel.agreements.filter(
							(i) => i.Type == "NDA"
						);
						oModel.filtered.EXP = oModel.agreements
							.filter((i) => i.Status === "Active")
							.filter((i) => {
								const diff = new Date(i.AgreementEndDate) - new Date();
								const remaining_days = Math.round(diff / (1000 * 60 * 60 * 24));
								return remaining_days < 30;
							});
						oModel.length = {};
						Object.keys(oModel.filtered).map(
							(i) => (oModel.length[i] = oModel.filtered[i].length)
						);
						oModel.start_date = {};
						oModel.end_date = {};
						oModel.start_date = new Date(
							Math.min(
								...oModel.agreements
									.map((agreement) =>
										new Date(agreement.AgreementStartDate).getTime()
									)
									.filter((date) => !isNaN(date))
							)
						);
						oModel.end_date = new Date(
							Math.max(
								...oModel.agreements
									.map((agreement) =>
										new Date(agreement.AgreementEndDate).getTime()
									)
									.filter((date) => !isNaN(date))
							)
						);

						this.setModel(new JSONModel(oModel), "docs");

						console.log(this.getModel("docs"));
						this.setModel(new JSONModel(data), "docsDupat");
						console.log(
							"the fetch is working just fine and here is the data from api, ",
							data
						);
					}).catch(console.error);


					// fetch("http://yw:8000/sow_candent_api/create_user/")
					fetch("http://excavator:8000/sow_candent_api/login/")
					.then((res) => res.json())
					.then((data) => {
						console.log(data)
						// var usersData= [];
						// var oModel = {};
						// this.setModel(new JSONModel(oModel), "users");
						// console.log(this.getModel("users"));
						this.setModel(new JSONModel(data), "users");
						console.log("Login fetch is working poperly", data);
					})
					.catch((error) => {
						console.error;
						sap.ui.core.BusyIndicator.hide();
					});
			},
			// onBeforeRouteMatched: function (oEvent) {
			// 	// Access isAuthenticated from a model or service (replace with your logic)
			// 	debugger;
			// 	const isAuthenticated = false; // Replace with actual logic
			// 	const allowedRoutes = ["RouteLogin"];
			// 	const oArgs = oEvent.getParameters().name; // Assuming the route name is stored in "name" parameter
			// 	console.log("viewName - ", oArgs);
			// 	if (!isAuthenticated && !allowedRoutes.includes(oArgs)) {
			// 		oEvent.preventDefault();
			// 		this.getRouter().navTo(allowedRoutes[0]); // Navigate to "RouteLogin" if not authenticated
			// 	}
			// },
		});
	}
);
