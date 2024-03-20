/**
 * @override
 */

sap.ui.define(
	[
		"sap/ui/core/mvc/Controller",
		"sap/ui/model/json/JSONModel",
		"com/candentech/sowtracker/enum/password",
		"sap/f/Card",
		"sap/m/MessageToast",
		"sap/m/Text",
		"../model/formatter",
		"sap/m/MessageBox",
		"com/candentech/sowtracker/enum/services",
	],
	function (
		Controller,
		MessageToast,
		JSONModel,
		ePassword,
		Card,
		Text,
		formatter,
		MessageBox,
		services
	) {
		"use strict";

		return Controller.extend("com.candentech.sowtracker.controller.Admin", {
			formatter: formatter,
			onInit: function () {
				var oModel = this.getOwnerComponent().getModel("userdetails");
				console.log("this is oModel -- ", oModel);
				// if (oModel == "admin") {
				// 	fetch("http://yw:8000/sow_candent_api/userapi/")
				// 		.then((res) => res.json())
				// 		.then((data) => {
				// 			console.log(data);
				// 			// var usersData= [];
				// 			// var oModel = {};
				// 			// this.setModel(new JSONModel(oModel), "users");
				// 			// console.log(this.getModel("users"));
				// 			this.getView().setModel(new JSONModel(data), "users");
				// 			console.log("Login fetch is working poperly", data);
				// 		})
				// 		.catch((error) => {
				// 			console.error;
				// 			sap.ui.core.BusyIndicator.hide();
				// 		});
				// }
			},
			handleOpen: function () {
				this.qDialog ??= this.loadFragment({
					name: "com.candentech.sowtracker.view.Dialog",
				});

				this.qDialog.then((oDialog) => oDialog.open());
			},

			handleClose: function () {
				var oDialog = this.getView().byId("idDialog");
				oDialog.close();
			},
			handleSubmit() {},

			onShowPassword: function () {
				var oPasswordInput = this.byId("idPassword");
				var temp = oPasswordInput.getValueHelpIconSrc().split("://");

				var state = temp.pop();

				temp.push(ePassword.opposite_state[state]);

				oPasswordInput.setType(ePassword.input_type[state]);
				oPasswordInput.setValueHelpIconSrc(temp.join("://"));
			},

			onDeleteButtonPress: function (oEvent) {
				debugger;
				var oModel = this.byId("gridList");
				const sPath = oEvent.getSource().getBindingContext("users").getPath();
				const { id: id } = oModel.getModel("users").getProperty(sPath);

				MessageBox.confirm("Are you sure to delete the record?", {
					title: "Confirm",
					onClose: function (sAction) {
						if (sAction === "OK" && id) {
							fetch("http://yw:8001/sow_candent_api/userapi/", {
								method: "DELETE",
								body: JSON.stringify({
									id: id,
								}),
							})
								.then((res) => {
									if (res.ok) {
										sap.m.MessageToast.show("Record deleted successfully.");
										// oTable.removeItem(oSelectedItem);
									} else {
										sap.m.MessageToast.show("Failed to delete the record.");
									}
								})
								.catch((error) => {
									sap.m.MessageToast.show(
										"An error occurred: " + error.message
									);
								});
						}
					},
				});
			},
			onEditButtonPress(oEvent) {
				var sPath = oEvent.getSource().getBindingContext("users").getPath();
			},
		});
	}
);
