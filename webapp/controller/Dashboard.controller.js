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
				var oSearchField1 = oTable.byId("type");
				var oSearchField2 = oTable.byId("companyName");
				var oSearchField3 = oTable.byId("projectName");
				var oComboBox = oTable.byId("status");
				console.log(oSelectedValue, oEvent);
				oComboBox.setValue("Active");

				oSearchField1.setValue(oSelectedValue["type"]);
				oSearchField1.fireChange({ query: oSelectedValue["type"] });
				oSearchField2.setValue(oSelectedValue["Company Name"]);
				oSearchField2.fireChange({ query: oSelectedValue["Company Name"] });
				oSearchField3.setValue(oSelectedValue["project name"]);
				oSearchField3.fireChange({ query: oSelectedValue["project name"] });
				oComboBox.fireChange({ value: "Active" });
				oVizFrame.vizSelection([], { clearSelection: true });
			},
			routeToTableViaCard(oEvent) {
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
				var oSearchField1 = oTable.byId("type");
				var oSearchField2 = oTable.byId("companyName");
				var oSearchField3 = oTable.byId("projectName");
				var oComboBox = oTable.byId("status");
				oComboBox.setValue("Active");
				// oComboBox.fireChange({ value: "Active" });
				oSearchField1.setValue(oType);
				oSearchField1.fireChange({ query: oType });
				oSearchField2.setValue(oCompanyName);
				oSearchField2.fireChange({ query: oCompanyName });
				oSearchField3.setValue(oProjectName);
				oSearchField3.fireChange({ query: oProjectName });
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
				var oSearchField1 = oTable.byId("Type");
				var oSearchField2 = oTable.byId("CompanyName");
				var oSearchField3 = oTable.byId("ProjectName");
				var oComboBox = oTable.byId("Status");
				oComboBox.setValue("Active");
				oComboBox.fireChange({ value: "Active" });
				oSearchField1.setValue(oType);
				oSearchField1.fireChange({ query: oType });
				oSearchField2.setValue(oCompanyName);
				oSearchField2.fireChange({ query: oCompanyName });
				oSearchField3.setValue(oProjectName);
				oSearchField3.fireChange({ query: oProjectName });
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
			},
		});
	}
);
