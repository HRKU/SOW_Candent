sap.ui.define(
	[
		"sap/ui/core/mvc/Controller",
		"sap/m/MessageToast",
		"com/candentech/sowtracker/enum/password",
		"com/candentech/sowtracker/enum/services",
		"sap/ui/model/json/JSONModel",
	],
	function (Controller, MessageToast, ePassword, services, JSONModel) {
		"use strict";

		return Controller.extend("com.candentech.sowtracker.controller.Login", {
			_oRouter: null,
			onInit: function () {
				this._oRouter = this.getOwnerComponent().getRouter();
				this.getView().byId("username").setValueState("None");
				this.getView().byId("password").setValueState("None");
				document.addEventListener("keydown", this.onKeyPress.bind(this), false);
			},


			//Enter Key event
			onKeyPress: function (event) {
				var loginButton = this.byId("idLoginButton");
				if (event.key === "Enter" && loginButton) {
					var oUsername = this.getView().byId("username");
					var oPassword = this.getView().byId("password");
	
					if (!oUsername.getValue()) {
						oUsername.focus();
						return;
					}
					if (!oPassword.getValue()) {
						oPassword.focus();
						return;
					}
					loginButton.firePress();
				}
			},


			// Show/Hide Password Function
			onShowPasswordSelect: function () {
				// debugger;
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
				console.log(oModel);
				// http://192.168.1.56:8007/sow_candent_api/login/
				fetch(services.login, {
					method: "POST",
					body: JSON.stringify(oModel.getData()),
					credentials: "include", // Instead of 'withCredentials: true'
				})
					.then((response) => {
						if (response.status == 200) {
							return response.json();
						} else {
							throw new Error(
								"Login failed. Please check your email and password."
							);
						}
					})
					.then((data) => {
						console.log(data);
						MessageToast.show("Login successful");
						// debugger;
						// document.cookie = `token=${data.token}; maxAge=${
						// 	1000 * 60 * 60 * 24
						// };`;
						var oUserDetails = new JSONModel(
							JSON.parse(
								// atob(
								// 	Object.fromEntries([document.cookie.split("=")]).token.split(
								// 		"."
								// 	)[1]
								// )
							)
						);
						this.getOwnerComponent().setModel(oUserDetails, "userdetails");
						this._oRouter.navTo("RouteDashboard");
						location.reload();
					})
					.catch((error) => {
						// debugger
						MessageToast.show("Something Went Wrong " + error);
						// document.cookie = `token=; maxAge=0;`;
						document.cookie = `token=;expires=${new Date(0).toUTCString()}`;
						document.cookie = `token=;expires=${new Date(0).toUTCString()}`;
						localStorage.removeItem("token");
					});
			},
		});
	}
);
