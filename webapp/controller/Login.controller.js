sap.ui.define(
	[
		"sap/ui/core/mvc/Controller",
		"sap/m/MessageToast",
		"com/candentech/sowtracker/enum/services",
	],
	function (Controller, MessageToast, services) {
		"use strict";

		return Controller.extend("com.candentech.sowtracker.controller.Login", {
			onInit: function () {
				this.getView().byId("username").setValueState("None");
				this.getView().byId("password").setValueState("None");
			},

			// Email Validation
			validateEmail: function (username) {
				var re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
				return re.test(String(username).toLowerCase());
			},

			// Show Password Function
			onShowPasswordSelect: function () {
				var oPasswordInput = this.byId("password");
				var sIconSrc = oPasswordInput.getValueHelpIconSrc();

				if (sIconSrc === "sap-icon://show") {
					oPasswordInput.setType("Text");
					oPasswordInput.setValueHelpIconSrc("sap-icon://hide");
				} else {
					oPasswordInput.setType("Password");
					oPasswordInput.setValueHelpIconSrc("sap-icon://show");
				}
			},

			// OnLogin press Function
			onLoginPress: function () {
				var oView = this.getView();
				var oEmail = oView.byId("username");
				var oPassword = oView.byId("password");

				if (!this.validateEmail(oEmail.getValue())) {
					// oEmail.setValueState("Error");
					// oEmail.setValueStateText(
					// 	"Please enter a valid email address"
					// );
					// return;
				} else {
					oEmail.setValueState("None");
				}

				if (!oPassword.getValue()) {
					oPassword.setValueState("Error");
					oPassword.setValueStateText("Please enter your password");
					return;
				} else {
					oPassword.setValueState("None");
					// const oRouter = this.getOwnerComponent().getRouter();
					// oRouter.navTo("RouteDashboard");
				}

				//Fetch Apis
				// debugger;
				var oModel = new sap.ui.model.json.JSONModel();
				oModel.setProperty("/username", oEmail.getValue());
				oModel.setProperty("/password", oPassword.getValue());

				fetch(services.login, {
					method: "POST",
					body: JSON.stringify(oModel.getData()),
				})
					.then((response) => {
						// console.log(response.json());
						if (response.status == 200) {
							MessageToast.show("Login successful");
						} else {
							MessageToast.show(
								"Login failed. Please check your email and password."
							);
						}
						return response.json();
					})
					.then((data) => {
						console.log(data);
					})
					.catch((error) => {
						MessageToast.show("Something Went Wrong " + error);
					});
			},
		});
	}
);
