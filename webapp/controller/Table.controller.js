sap.ui.define(
	["sap/ui/core/mvc/Controller", "sap/ui/model/json/JSONModel"],
	(Controller, JSONModel) => {
		"use strict";

		return Controller.extend("com.candentech.sowtracker.controller.Table", {
			onInit: function () {},
			onOpenDialog() {
				debugger;
				// create dialog lazily
				this.pDialog ??= this.loadFragment({
					name: "com.candentech.sowtracker.view.AddSowDialog",
				});

				this.pDialog.then((oDialog) => oDialog.open());
			},
		});
	}
);
