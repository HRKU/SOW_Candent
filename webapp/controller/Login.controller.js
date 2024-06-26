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
				if (document.cookie.includes("token")) {
					this._oRouter.navTo("RouteDashboard");
					location.reload();
				}
			},

			//can login when pressing enter on the keyboard
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

				var oModel = new sap.ui.model.json.JSONModel();
				oModel.setProperty("/username", oEmail.getValue());
				oModel.setProperty("/password", oPassword.getValue());

				fetch(services.login, {
					method: "POST",
					body: JSON.stringify(oModel.getData()),
					credentials: "include",
				})
					.then((res) => res.json())
					.then((data) => {
						if (data.error) {
							MessageToast.show("Invalid Login Credentials");
							throw new Error("LOGIN ERROR");
						}
						MessageToast.show(data.message);
						document.cookie = `token=${data.token}; maxAge=${
							1000 * 60 * 60 * 24
						};`;
						var oUserDetails = new JSONModel(
							JSON.parse(
								atob(
									Object.fromEntries([document.cookie.split("=")]).token.split(
										"."
									)[1]
								)
							)
						);
						this.getOwnerComponent().setModel(oUserDetails, "userdetails");
						this._oRouter.navTo("RouteDashboard");
						location.reload();
					})
					.catch((error) => {
						console.log({
							...error,
						});
						document.cookie = `token=;expires=${new Date(0).toUTCString()}`;
						localStorage.removeItem("token");
					});
			},
		});
	}
);
