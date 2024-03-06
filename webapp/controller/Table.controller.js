sap.ui.define(
	[
		"sap/ui/core/mvc/Controller",
		"sap/ui/model/json/JSONModel",
		"sap/m/MessageToast",
	],
	(Controller, JSONModel, MessageToast) => {
		"use strict";

		return Controller.extend("com.candentech.sowtracker.controller.Table", {
			onInit: function () {
				const oModel = this.getOwnerComponent().getModel("docs");
				const oLabels = [
					"SrNo",
					"CompanyName",
					"Type",
					"AgreementNo",
					"ProjectName",
					"AgreementDate",
					"AgreementStartDate",
					"AgreementEndDate",
					"ProjectType",
					"Status",
				];

				var oTable = this.byId("projectTable");
				var oCell = [];

				oLabels.map((i) => {
					var oColumn = new sap.m.Column("col" + i, {
						header: new sap.m.Label({
							text: i,
						}),
					});
					var cell1 = new sap.m.Text({
						text: "{docs>" + i + "}",
					});
					oCell.push(cell1);
					oTable.addColumn(oColumn);
				});
				var aColList = new sap.m.ColumnListItem("aColList", {
					cells: oCell,
				});
				oTable.setModel(oModel);
				oTable.bindItems(
					"docs>/", // Adjust path as per your model structure
					aColList
				);
			},
			onOpenDialog() {
				// create dialog lazily
				this.pDialog ??= this.loadFragment({
					name: "com.candentech.sowtracker.view.AddSowDialog",
				});

				this.pDialog.then((oDialog) => oDialog.open());
			},
			onCloseDialog() {
				this.pDialog ??= this.loadFragment({
					name: "com.candentech.sowtracker.view.AddSowDialog",
				});

				this.pDialog.then((oDialog) => oDialog.close());
			},
			onSubmit() {
				var oIds = [
					"CompanyName",
					"ProjectName",
					"AgreementNo",
					"Status",
					"ProjectType",
					"Type",
					"AgreementDate",
					"AgreementStartDate",
					"AgreementEndDate",
				];

				var oControls = {};
				var valuesToBeSent = {};

				oIds.map((id) => {
					oControls[id] = this.byId(id);
				});

				console.log(oControls);

				for (var key in oControls) {
					if (!oControls[key].getValue()) {
						oControls[key].setValueState("Error");
						oControls[key].setValueStateText("Please Input Value");
						return;
					} else {
						oControls[key].setValueState();
						valuesToBeSent[key] = oControls[key].getValue();
					}
				}

				var startDate = new Date(valuesToBeSent["AgreementStartDate"]);
				var endDate = new Date(valuesToBeSent["AgreementEndDate"]);
				if (startDate >= endDate) {
					oControls["AgreementStartDate"].setValueState("Error");
					oControls["AgreementStartDate"].setValueStateText(
						"Start date must be earlier than end date"
					);
					return;
				} else {
					oControls["AgreementStartDate"].setValueState();
				}

				console.log(valuesToBeSent);

				fetch("http://excavator:8000/sow_candent_api/agreements/create/", {
					method: "POST",
					body: JSON.stringify(valuesToBeSent),
				})
					.then((response) => {
						// console.log(response.json());
						if (response.status == 201) {
							MessageToast.show("Created Succesfully");
						} else {
							MessageToast.show("Did not Create field");
						}
						return response.json();
					})
					.then((data) => {
						console.log(data);
					})
					.catch((error) => {
						MessageToast.show("Something Went Wrong " + error);
					});
				this.pDialog ??= this.loadFragment({
					name: "com.candentech.sowtracker.view.AddSowDialog",
				});

				this.pDialog.then((oDialog) => oDialog.close());
			},
			onEdit() {
				debugger;
			},
			onDelete() {},
		});
	}
);
