sap.ui.define(
	["sap/ui/core/mvc/Controller", "sap/m/MessageToast"],
	function (Controller, MessageToast) {
		"use strict";

		return Controller.extend("com.candentech.sowtracker.controller.Main", {
			onInit: function () {
				// if (!document.cookie) {
				// 	this.getOwnerComponent().getRouter().navTo("RouteLogin", {}, true);
				// 	location.reload();
				// }
			},
			// following functions control header toolbar navigation
			setVisibleDash() {
				this.byId("dash").setVisible(true);
				this.byId("table").setVisible(false);
				this.byId("admin").setVisible(false);
				this.byId("dashboard").setText("Dashboard");
				this.byId("backButton").setVisible(false);
			},
			setVisibleTable() {
				this.byId("dash").setVisible(false);
				this.byId("admin").setVisible(false);
				this.byId("table").setVisible(true);
				this.byId("dashboard").setText("Table Data");
				this.byId("backButton").setVisible(true);
			},
			onAvatarPress() {
				this.byId("dash").setVisible(false);
				this.byId("table").setVisible(false);
				this.byId("admin").setVisible(true);
				this.byId("dashboard").setText("Admin");
				this.byId("backButton").setVisible(true);
			},
			onNavBack() {
				this.byId("dash").setVisible(true);
				this.byId("table").setVisible(false);
				this.byId("admin").setVisible(false);
				this.byId("dashboard").setText("Dashboard");
				this.byId("backButton").setVisible(false);
			},
			onLogout() {
				var oRouter = this.getOwnerComponent().getRouter();
				MessageToast.show("Logged out successfully");
				oRouter.navTo("RouteLogin", {}, true);
				document.cookie = `token=;expires=${new Date(0).toUTCString()}`;
			},
		});
	}
);
