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
				// , '#5B738B''#6C32A9', '#BA066C',
			},
			navAvatar() {},
			routeToTableViaChart: function (oEvent) {
				debugger;
				const oSelectedValue = oEvent
					.getParameter("data")
					.map((i) => i.data)
					.pop();
				var oVizFrame = oEvent.getSource();

				var oParent = this.getView().getParent().getParent();
				oParent.byId("dash").setVisible(false);
				oParent.byId("admin").setVisible(false);
				var oTable = oParent.byId("table");
				oTable.setVisible(true);
				oParent.byId("dashboard").setText("Table Data");
				var oSearchField1 = oTable.byId("_IDGenSearchField1");
				var oSearchField2 = oTable.byId("_IDGenSearchField2");
				var oSearchField3 = oTable.byId("_IDGenSearchField3");
				var oComboBox = oTable.byId("filterStatusComboBox");
				console.log(oSelectedValue, oEvent);
				oComboBox.setValue("Active");

				oSearchField1.setValue(oSelectedValue["type"]);
				oSearchField1.fireSearch({ query: oSelectedValue["type"] });
				oSearchField2.setValue(oSelectedValue["Company Name"]);
				oSearchField2.fireSearch({ query: oSelectedValue["Company Name"] });
				oSearchField3.setValue(oSelectedValue["project name"]);
				oSearchField3.fireSearch({ query: oSelectedValue["project name"] });
				oComboBox.fireChange({ value: "Active" });
				oVizFrame.vizSelection([], { clearSelection: true });
			},
			routeToTableViaCard(oEvent) {
				debugger;
				var sProjectName = oEvent
					.getSource()
					.getBindingContext("docs")
					.getProperty("ProjectName");
				var sType = oEvent
					.getSource()
					.getBindingContext("docs")
					.getProperty("Type");
				const oSelctedItem = oEvent.getSource().mProperties;
				var oParent = this.getView().getParent().getParent();
				oParent.byId("dash").setVisible(false);
				oParent.byId("admin").setVisible(false);
				var oTable = oParent.byId("table");
				oTable.setVisible(true);
				oParent.byId("dashboard").setText("Table Data");
				var oSearchField1 = oTable.byId("_IDGenSearchField1");
				var oSearchField2 = oTable.byId("_IDGenSearchField2");
				var oSearchField3 = oTable.byId("_IDGenSearchField3");
				var oComboBox = oTable.byId("filterStatusComboBox");
				oComboBox.setValue("Active");
				oComboBox.fireChange({ value: "Active" });
				oSearchField1.setValue(sType);
				oSearchField1.fireSearch({ query: sType });
				oSearchField2.setValue(oSelctedItem["intro"]);
				oSearchField2.fireSearch({ query: oSelctedItem["intro"] });
				oSearchField3.setValue(sProjectName);
				oSearchField3.fireSearch({ query: sProjectName });
			},
			routeToTableViaTile(oEvent) {
				debugger;
				var oProjectName = oEvent
					.getSource()
					.getBindingContext("docs")
					.getProperty("ProjectName");
				var oCompanyName = oEvent
					.getSource()
					.getBindingContext("docs")
					.getProperty("CompanyName");
				var oType = oEvent
					.getSource()
					.getBindingContext("docs")
					.getProperty("Type");

				var oParent = this.getView().getParent().getParent();
				oParent.byId("dash").setVisible(false);
				oParent.byId("admin").setVisible(false);
				var oTable = oParent.byId("table");
				oTable.setVisible(true);
				oParent.byId("dashboard").setText("Table Data");
				var oSearchField1 = oTable.byId("_IDGenSearchField1");
				var oSearchField2 = oTable.byId("_IDGenSearchField2");
				var oSearchField3 = oTable.byId("_IDGenSearchField3");
				var oComboBox = oTable.byId("filterStatusComboBox");
				oComboBox.setValue("Active");
				oComboBox.fireChange({ value: "Active" });
				oSearchField1.setValue(oType);
				oSearchField1.fireSearch({ query: oType });
				oSearchField2.setValue(oCompanyName);
				oSearchField2.fireSearch({ query: oCompanyName });
				oSearchField3.setValue(oProjectName);
				oSearchField3.fireSearch({ query: oProjectName });
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
						(new Date(date) - new Date()) / (1000 * 60 * 60 * 24)
					);
					if (x <= 30 && x > -16) {
						return `${x} Day${x > 1 ? "s" : ""}`;
					}

					return;
				},
				calculateExpiryChart(date) {
					let x = Math.round(
						Math.abs((new Date(date) - new Date()) / (1000 * 60 * 60 * 24))
					);

					return x;
				},
				expiryColor(date) {
					let x = Math.round(
						(new Date(date) - new Date()) / (1000 * 60 * 60 * 24)
					);
					if (x > 15 && x < 30) {
						return "Success";
					}
					if (x > 5 && x <= 15) {
						return "Warning";
					}
					if (x <= 5 && x > 0) {
						return "Error";
					} else {
						return "None";
					}

					return;
				},
				getShapeColor(doctype) {
					switch (doctype) {
						case "MSA":
							return "sapUiAccent3";
						case "NDA":
							return "sapUiAccent5";
						case "SOW":
							return "sapUiAccent9";
						default:
							return "sapUiAccent10";
					}
				},
			},
			filterDocs(oEvent) {
				debugger;

				var oBinding1 = this.byId("barchartContainer1")
					.getDataset()
					.getBinding("data");
				var oBinding2 = this.byId("barchartContainer2")
					.getDataset()
					.getBinding("data");

				var sSelectedKey = oEvent.getSource().getProperty("scale"); // Use getProperty instead of accessing directly via mProperties

				// Clear previous filters before applying new ones
				oBinding1.filter([]);
				oBinding2.filter([]);

				if (sSelectedKey === "ALL" || !sSelectedKey) {
					// Handle null or undefined sSelectedKey
					return;
				} else {
					var newFilter = new sap.ui.model.Filter(
						"Type",
						sap.ui.model.FilterOperator.EQ,
						sSelectedKey
					);

					// Apply the same filter to all bindings
					oBinding1.filter(newFilter);
					oBinding2.filter(newFilter);
				}
			},
			filterDocs1(oEvent) {
				debugger;
				var oBinding = this.byId("barchartContainer")
					.getDataset()
					.getBinding("data");

				var oBinding3 = this.byId("barchartContainer3")
					.getDataset()
					.getBinding("data");
				var sSelectedKey = oEvent
					.getSource()
					.getCustomData()
					.map((i) => i.getKey())
					.pop();

				oBinding3.filter([]);
				oBinding.filter([]);

				if (sSelectedKey === "All" || !sSelectedKey) {
					// Handle null or undefined sSelectedKey
					return;
				} else {
					var newFilter = new sap.ui.model.Filter(
						"Type",
						sap.ui.model.FilterOperator.EQ,
						sSelectedKey
					);

					// Apply the same filter to all bindings

					oBinding3.filter(newFilter);
					oBinding.filter(newFilter);
				}
			},
		});
	}
);
