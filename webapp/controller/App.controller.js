sap.ui.define(
	[
	"sap/ui/core/mvc/Controller", 
	"sap/ui/core/Fragment",
	"sap/m/MessageToast"
	], 
	function (BaseController, Fragment,MessageToast) {
	"use strict";

	return BaseController.extend("com.candentech.sowtracker.controller.App", {
		onInit: function () {
			if (location.hash !== "" && location.hash !== "#/forgotPassword" && location.hash !== "#/pdf") {

				Fragment.load({
					id:this.createId("myFragment"),
					name: "com.candentech.sowtracker.view.fragments.NavBar",
					controller: this
				}).then(function (oFragment) {
					this.getView().byId("idNavigationBar").addItem(oFragment);
				}.bind(this));
			}

		},
		onPressDash() {
			this.getOwnerComponent().getRouter().navTo("RouteDashboard");
			var fragmentId = this.createId("myFragment--");
			this.byId(fragmentId + "backButton").setVisible(false);
			this.byId(fragmentId + "dashboard").setText("Dashboard");
			// location.reload();
		},
		onPressTable() {
			var fragmentId = this.createId("myFragment--");
			this.byId(fragmentId + "backButton").setVisible(true);
			this.byId(fragmentId + "dashboard").setText("Table");
			this.getOwnerComponent().getRouter().navTo("RouteTable");
			var fragmentLoaded = this.getView().byId("idNavigationBar").getItems().length > 0;
			if (fragmentLoaded) {
				var dashboardElement = this.getView().byId("idNavigationBar").getItems()[0].byId("dashboard");
				if (dashboardElement) {
					dashboardElement.setText("Table");
				} else {
					console.error("Element with ID 'dashboard' not found in the fragment.");
				}
			} else {
				console.error("Fragment containing the dashboard not loaded.");
			}
			location.reload();

		},
		onAvatarPress() {
			var fragmentId = this.createId("myFragment--");
			this.byId(fragmentId + "backButton").setVisible(true);
			this.byId(fragmentId + "dashboard").setText("Admin");
			this.getOwnerComponent().getRouter().navTo("RouteAdmin");
			// location.reload();
		},
		onNavBack() {
			this.getOwnerComponent().getRouter().navTo("RouteDashboard");
			var fragmentId = this.createId("myFragment--");
			this.byId(fragmentId + "backButton").setVisible(false);
			this.byId(fragmentId + "dashboard").setText("Dashboard");
		},
		onLogout() {
			// debugger;
			var oRouter = this.getOwnerComponent().getRouter();
			MessageToast.show("Logged out successfully");
			oRouter.navTo("RouteLogin", {}, true);
			document.cookie = `token=;expires=${new Date(0).toUTCString()}`;
			location.reload();
		}
	});
});