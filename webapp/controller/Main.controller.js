sap.ui.define(
	["sap/ui/core/mvc/Controller", "sap/ui/model/json/JSONModel"],
	function (Controller, JSONModel) {
		"use strict";

		return Controller.extend("com.candentech.sowtracker.controller.Main", {
			onInit: function () {},
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
			onOpenPopover() {},
		});
	}
);
