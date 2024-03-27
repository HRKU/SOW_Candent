sap.ui.define(
	[
		"sap/ui/core/mvc/Controller",
		"sap/m/MessageToast",
		"com/candentech/sowtracker/enum/password",
		"com/candentech/sowtracker/enum/services",
	],
	function (Controller, MessageToast, ePassword, services) {
		"use strict";

		return Controller.extend("com.candentech.sowtracker.controller.Login", {
			_oRouter: null,
			onInit: function () {
				this._oRouter = this.getOwnerComponent().getRouter();
				this.getView().byId("username").setValueState("None");
				this.getView().byId("password").setValueState("None");
			},

			// Show/Hide Password Function
			onShowPasswordSelect: function () {
				var oPasswordInput = this.byId("password");
				var temp = oPasswordInput.getValueHelpIconSrc().split("://");

				var state = temp.pop();

				temp.push(ePassword.opposite_state[state]);

				oPasswordInput.setType(ePassword.input_type[state]);
				oPasswordInput.setValueHelpIconSrc(temp.join("://"));
			},

			// OnLogin press Function
			onLoginPress: function () {
				var oView = this.getView();
				var oEmail = oView.byId("username");
				var oPassword = oView.byId("password");

				// if (!this.validateEmail(oEmail.getValue())) {
				//     oEmail.setValueState("Error");
				//     oEmail.setValueStateText("Please enter a valid email address");
				//     return;
				// } else {
				//     oEmail.setValueState("None");
				// }

				// if (!oPassword.getValue()) {
				//     oPassword.setValueState("Error");
				//     oPassword.setValueStateText("Please enter your password");
				//     return;
				// } else {
				//     oPassword.setValueState("None");
				// }

				var oModel = new sap.ui.model.json.JSONModel();
				oModel.setProperty("/username", oEmail.getValue());
				oModel.setProperty("/password", oPassword.getValue());

				fetch(services.login, {
					method: "POST",
					body: JSON.stringify(oModel.getData()),
				})
					.then((response) => {
						if (response.status == 200) {
							MessageToast.show("Login successful");

							const oRouter = this.getOwnerComponent().getRouter();
							oRouter.navTo("RouteDashboard");
						} else {
							throw new Error(
								"Login failed. Please check your email and password."
							);
						}
					})
					.then((data) => {
						console.log(data);
						// if (data.token) {
						// 	// window.document.cookie = `token=${data.token}; Max-Age=604800;`;
						// 	this.getRouter().navTo("RouteDashboard");
						// }
					})
					.catch((error) => {
						// debugger
						MessageToast.show("Something Went Wrong " + error);
					})
					.finally(() => {
						sap.ui.core.BusyIndicator.hide();
						// document.cookie = `token=; maxAge=0;`;
					});
			},
		});
	}
);
