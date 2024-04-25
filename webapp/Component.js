/**
 * eslint-disable @sap/ui5-jsdocs/no-jsdoc
 */

sap.ui.define(
	[
		"sap/ui/core/UIComponent",
		"sap/ui/Device",
		"com/candentech/sowtracker/model/models",
		"sap/ui/model/json/JSONModel",
		"com/candentech/sowtracker/enum/services",
	],
	function (UIComponent, Device, models, JSONModel, services) {
		"use strict";

		return UIComponent.extend("com.candentech.sowtracker.Component", {
			metadata: {
				manifest: "json",
			},
			//setup of custom functions
			setup_customization: function () {
				window.Array.prototype.getUnique = function () {
					var o = {},
						a = [],
						i,
						e;
					for (i = 0; (e = this[i]); i++) {
						o[e] = 1;
					}
					for (e in o) {
						a.push(e);
					}
					return a;
				};
			},
			/**
			 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
			 * @public
			 * @override
			 */
			init: function () {
				UIComponent.prototype.init.apply(this, arguments);
				this.setup_customization();
				this.getRouter().initialize();
				this.setModel(models.createDeviceModel(), "device");
				this.initialize_data();
			},
			getUser: function () {
				return JSON.parse(
					atob(
						Object.fromEntries([document.cookie.split("=")]).token.split(".")[1]
					)
				);
			},
			initialize_data: function () {
				if (!document.cookie.includes("token")) {
					return;
				}
				var count = 1;
				var prevCompanyName = "";
				var oUserDetails = new JSONModel(this.getUser());
				this.setModel(oUserDetails, "userdetails");
				var oModel = this.getModel("userdetails");
				if (oModel) {
					fetch(services.agreementList)
						.then((res) => res.json())
						.then((data) => {
							// console.log(data);
							debugger;
							data
								.sort((a, b) => a.CompanyName.localeCompare(b.CompanyName))
								.forEach((item) => {
									if (item.CompanyName !== prevCompanyName) {
										count = 1;
										prevCompanyName = item.CompanyName;
									}
									item.id = count;
									count++;
								});

							var oModel = {};
							oModel.agreements = {};
							oModel.agreements = data;
							console.log(oModel.agreements);
							oModel.goingToExpire = {};
							oModel.goingToExpire = oModel.agreements
								.filter((i) => i.Status == "Active")
								.filter((i) => {
									const diff = new Date(i.AgreementEndDate) - new Date();
									const remaining_days = Math.round(
										diff / (1000 * 60 * 60 * 24)
									);
									if (remaining_days < 31 && remaining_days > -16) {
										return remaining_days;
									} else {
										return null;
									}
								});
							oModel.ExpLen = {};
							oModel.ExpLen = oModel.goingToExpire.length;
							oModel.filtered = {};
							oModel.filtered.types = oModel.agreements
								.map((i) => i.Type)
								.getUnique()
								.map((name) => ({
									name,
								}))
								.concat({ name: "EXPIRED" });
							oModel.filtered.len = {};
							oModel.filtered.types.forEach((type) => {
								oModel.filtered[type.name] = oModel.goingToExpire
									.filter((i) => i.Status == "Active")
									.filter((i) => i.Type == type.name)
									.filter((i) => {
										if (i) {
											const diff = new Date(i.AgreementEndDate) - new Date();
											const remaining_days = Math.round(
												diff / (1000 * 60 * 60 * 24)
											);
											return remaining_days > 0 && remaining_days < 31;
										}
									});
							});
							oModel.filtered.EXPIRED = oModel.goingToExpire.filter((i) => {
								const diff = new Date(i.AgreementEndDate) - new Date();
								const remaining_days = Math.round(diff / (1000 * 60 * 60 * 24));
								if (remaining_days <= 0 && remaining_days > -16) {
									return remaining_days;
								} else {
									return null;
								}
							});
							Object.keys(oModel.filtered.types).forEach((key) => {
								const typeKey = oModel.filtered.types[key].name;
								if (oModel.filtered[typeKey].length) {
									oModel.filtered.len[key] = {
										type: typeKey,
										len: oModel.filtered[typeKey].length,
									};
								}
							});
							oModel.Status = oModel.agreements
								.map((i) => i.Status)
								.getUnique()
								.map((name) => ({
									name,
									length: oModel.agreements.filter((i) => i.Status === name)
										.length,
									data: oModel.agreements.filter((i) => i.Status === name),
								}));
							oModel.CompanyName = oModel.agreements
								.map((i) => i.CompanyName)
								.getUnique()
								.map((name) => ({
									name,
									length: oModel.agreements.filter(
										(i) => i.CompanyName === name
									).length,
									data: oModel.agreements.filter((i) => i.CompanyName === name),
								}));
							oModel.ProjectName = oModel.agreements
								.map((i) => i.ProjectName)
								.getUnique()
								.map((name) => ({
									name,
									length: oModel.agreements.filter(
										(i) => i.ProjectName === name
									).length,
									data: oModel.agreements.filter((i) => i.ProjectName === name),
								}));
							oModel.Type = oModel.agreements
								.map((i) => i.Type)
								.getUnique()
								.map((name) => ({
									name,
									length: oModel.agreements.filter((i) => i.Type === name)
										.length,
									data: oModel.agreements.filter((i) => i.Type === name),
								}));
							oModel.ProjectType = oModel.agreements
								.map((i) => i.ProjectType)
								.getUnique()
								.map((name) => ({
									name,
									length: oModel.agreements.filter(
										(i) => i.ProjectType === name
									).length,
									data: oModel.agreements.filter((i) => i.ProjectType === name),
								}));
							oModel.AllLen = {};
							oModel.AllLen = oModel.agreements.length;
							this.setModel(new JSONModel(oModel), "docs");
							console.log(this.getModel("docs").getData());
							// console.log(
							// 	"the fetch is working just fine and here is the data from api",
							// 	data
							// );
							fetch(services.createUser)
								.then((res) => res.json())
								.then((data) => {
									this.setModel(new JSONModel(data), "users");
									// console.log("Login fetch is working poperly", data);
								})
								.catch((error) => {
									// console.error;
									sap.ui.core.BusyIndicator.hide();
								});
							sap.ui.core.BusyIndicator.hide();
						})
						.catch(console.error);
				}
			},
		});
	}
);
