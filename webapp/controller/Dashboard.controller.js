sap.ui.define(
	[
		"sap/ui/core/mvc/Controller",
		"sap/ui/model/json/JSONModel",
		"../model/formatter",
	],
	function (Controller, JSONModel, formatter) {
		"use strict";

		return Controller.extend("com.candentech.sowtracker.controller.Dashboard", {
			formatter: formatter,
			onInit: function () {
				
			},
			navAvatar() {
				this.pPopover ??= this.loadFragment({
					name: "com.candentech.sowtracker.view.AvatarMenu",
				});

				this.pPopover.then((oPopover) => oPopover.open());
			},

			formatter: {
				calculateDuration(date) {
					if (date) {
						return new Date(date);
					}
					return {};
				},
				calculateExpiry(date) {
					let x = Math.round(
						Math.abs((new Date(date) - new Date()) / (1000 * 60 * 60 * 24))
					);
					if (x < 30) {
						return x;
					}

					return;
				},
				getShapeColor(doctype) {
					switch (doctype) {
						case "MSA":
							return "sapUiAccent8";
						case "NDA":
							return "sapUiAccent2";
						case "SLA":
							return "sapUiAccent5";
						default:
							return "sapUiAccent4";
					}
				},
			},
			filterDocs(oEvent) {
				debugger;
				var oBinding = this.byId("mainTable").getBinding("rows");
				var sSelectedKey = oEvent
					.getSource()
					.getCustomData()
					.map((i) => i.getKey())
					.pop();
				oBinding.filter([]);
				if (sSelectedKey === "All") {
				} else if (sSelectedKey) {
					var newFilter = new sap.ui.model.Filter(
						"Type",
						sap.ui.model.FilterOperator.EQ,
						sSelectedKey
					);
					console.log(newFilter);
					oBinding.filter(newFilter);
				}
			},
		});
	}
);
