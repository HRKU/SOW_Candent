sap.ui.define(
	[
		"sap/ui/core/mvc/Controller",
		"sap/ui/model/json/JSONModel",
		"sap/m/MessageToast",
		"sap/m/MessageBox",
		"com/candentech/sowtracker/enum/services",
		"../model/formatter",
	],
	(Controller, JSONModel, MessageToast, MessageBox, services, formatter) => {
		"use strict";

		return Controller.extend("com.candentech.sowtracker.controller.Table", {
			formatter: formatter,
			onInit: function () {
				this.byId("_IDGenSearchField1").getValue();
				const oModel = this.getOwnerComponent().getModel("trial");
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
						text: "{trial>" + i + "}",
					});
					oCell.push(cell1);
					oTable.addColumn(oColumn);
				});
				var aColList = new sap.m.ColumnListItem("aColList", {
					cells: oCell,
				});
				oTable.setModel(oModel);
				var oSorter = new sap.ui.model.Sorter("CompanyName", false, true);
				oTable.bindItems({
					path: "trial>/agreements",
					template: aColList,
					sorter: oSorter,
				});
			},
			onFilter: function () {
				// Retrieve the filter values from SearchFields and ComboBox
				var sType = this.byId("_IDGenSearchField1").getValue();
				var sCompanyName = this.byId("_IDGenSearchField2").getValue();
				var sProjectName = this.byId("_IDGenSearchField3").getValue();
				var sStatus = this.byId("filterStatusComboBox").getValue();

				// Filter the data based on the retrieved values
				var aFilters = [];
				if (sType) {
					aFilters.push(
						new sap.ui.model.Filter(
							"Type",
							sap.ui.model.FilterOperator.Contains,
							sType
						)
					);
				}
				if (sCompanyName) {
					aFilters.push(
						new sap.ui.model.Filter(
							"CompanyName",
							sap.ui.model.FilterOperator.Contains,
							sCompanyName
						)
					);
				}
				if (sProjectName) {
					aFilters.push(
						new sap.ui.model.Filter(
							"ProjectName",
							sap.ui.model.FilterOperator.Contains,
							sProjectName
						)
					);
				}
				if (sStatus) {
					aFilters.push(
						new sap.ui.model.Filter(
							"Status",
							sap.ui.model.FilterOperator.EQ,
							sStatus
						)
					);
				}

				// Apply the filters to your table or list
				var oTable = this.byId("projectTable");
				var oBinding = oTable.getBinding("items");
				oBinding.filter(aFilters);
			},

			onClearFilter: function () {
				// Clear the values of SearchFields and ComboBox
				this.byId("_IDGenSearchField1").setValue("");
				this.byId("_IDGenSearchField2").setValue("");
				this.byId("_IDGenSearchField3").setValue("");
				this.byId("filterStatusComboBox").setSelectedKey("");

				// Reset the filters
				var oTable = this.byId("projectTable");
				var oBinding = oTable.getBinding("items");
				oBinding.filter([]);
			},

			onOpenDialog() {
				// debugger;
				this.pDialog ??= this.loadFragment({
					name: "com.candentech.sowtracker.view.fragments.AddSowDialog",
				});

				this.pDialog.then((oDialog) => oDialog.open());
				setTimeout(() => {
					var oDialog = this.byId("idAddAndEditSowDialog");
					console.log(oDialog);
					oDialog.setTitle("Add New Entry");
					this.byId("idEdtBtn").setVisible(false);
					this.byId("idSbtBtn").setVisible(true);
				}, 10);
			},
			onCloseDialog() {
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

				oIds.map((id) => {
					oControls[id] = this.byId(id);
				});
				for (var key in oControls) {
					if (oControls[key].getValue()) {
						oControls[key].setValue();
					}
				}
				this.pDialog ??= this.loadFragment({
					name: "com.candentech.sowtracker.view.fragments.AddSowDialog",
				});

				this.pDialog.then((oDialog) => oDialog.close());
			},
			onSubmit() {
				// debugger;
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

				// fetch("http://excavator:8000/sow_candent_api/agreements/create/", {
				fetch(services.agreementCreate, {
					method: "POST",
					body: JSON.stringify(valuesToBeSent),
				})
					.then((response) => {
						if (response.status == 201) {
							MessageToast.show("Created Succesfully");
							this.refresh();
						} else {
							MessageToast.show("Did not Create field");
						}
						return response.json();
					})
					.then((data) => {})
					.catch((error) => {
						MessageToast.show("Something Went Wrong " + error);
					});
				this.pDialog ??= this.loadFragment({
					name: "com.candenxtech.sowtracker.view.fragments.AddSowDialog",
				});
				for (var key in oControls) {
					if (oControls[key].getValue()) {
						oControls[key].setValue();
					}
				}

				this.pDialog.then((oDialog) => oDialog.close());
			},
			onSubmitEdit() {
				var oIds = [
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

				var oSelectedItem = this.byId("projectTable").getSelectedItem();
				if (!oSelectedItem) {
					MessageToast.show("Please select a row to edit");
					return;
				}

				var iSrNo = oSelectedItem.getCells()[0].getText();
				var oModel = oSelectedItem.getModel("docs");
				var oData = oModel.getProperty(oSelectedItem.getBindingContextPath());

				var oControls = {};
				var valuesToBeSent = {};

				oIds.map((id) => {
					oControls[id] = this.byId(id);
				});

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

				valuesToBeSent["SrNo"] = parseInt(iSrNo);
				console.log(oControls, valuesToBeSent, "this is srNo", iSrNo);

				fetch(services.update, {
					method: "PUT",
					body: JSON.stringify(valuesToBeSent),
				})
					.then((response) => {
						if (response.ok) {
							MessageToast.show("Updated Successfully");

							oModel.setProperty(
								oSelectedItem.getBindingContextPath(),
								valuesToBeSent
							);
						} else {
							MessageToast.show("Failed to update fields");
						}
						return response.json();
					})
					.then((data) => {
						console.log(data);
					})
					.catch((error) => {
						MessageToast.show("Something went wrong: " + error);
					});

				for (var key in oControls) {
					if (oControls[key].getValue()) {
						oControls[key].setValue();
					}
				}

				var oDialog = this.byId("idAddAndEditSowDialog");
				if (oDialog) {
					oDialog.close();
				}
			},

			onOpenEdit() {
				this.pDialog ??= this.loadFragment({
					name: "com.candentech.sowtracker.view.fragments.AddSowDialog",
				});

				var oSelectedRow = this.byId("projectTable").getSelectedItem();
				if (!oSelectedRow) {
					MessageToast.show("Please select row to edit");
					return;
				}

				this.pDialog.then((oDialog) => oDialog.open());

				var oIds = [
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

				setTimeout(() => {
					var oDialog = this.byId("idAddAndEditSowDialog");

					if (oSelectedRow) {
						var items = oSelectedRow.getCells().map((i) => i.getText());
						items.shift();
						oIds.map((id, index) => this.byId(id).setValue(items[index]));
					}

					oDialog.setTitle("Edit Fields");
					this.byId("idSbtBtn").setVisible(false);
					this.byId("idEdtBtn").setVisible(true);
				}, 50);
			},

			onFileUpload(oEvent) {
				var oFile = oEvent.getParameter("files")[0];

				if (oFile) {
					var formData = new FormData();
					formData.append("excel_file", oFile);
					fetch(services.uploadexcel, {
						method: "POST",
						body: formData,
					})
						.then((response) => {
							if (!response.ok) {
								MessageToast.show("File Failed to upload");
								throw new Error("Error uploading file");
							}
							return response.json();
						})
						.then((data) => {
							MessageToast.show("File Uploaded Successfully");
							console.log("File uploaded successfully:", data);
						})
						.catch((error) => {
							console.error("Error uploading file:", error);
						});
				} else {
					sap.m.MessageToast.show("No file selected");
				}
			},

			onDelete() {
				// debugger;
				const oTable = this.byId("projectTable");
				const oSelectedItem = oTable.getSelectedItem();

				// Check whether the data are selected or not

				if (!oSelectedItem) {
					MessageToast.show("Please select the Record to delete");
					return;
				}
				console.log(oSelectedItem);
				const sPath = oSelectedItem.getBindingContext("docs").getPath();
				const { SrNo: iSrNo } = oSelectedItem
					.getModel("docs")
					.getProperty(sPath);
				console.log(sPath);
				window.oTable = oTable;
				// debugger;

				MessageBox.confirm("Are you sure to delete the record?", {
					title: "Confirm",
					onClose: function (sAction) {
						if (sAction === "OK" && iSrNo) {
							fetch(services.delete, {
								method: "DELETE",
								body: JSON.stringify({
									SrNo: iSrNo,
								}),
							})
								.then((res) => {
									if (res.ok) {
										sap.m.MessageToast.show("Record deleted successfully.");
										oTable.removeItem(oSelectedItem);
									} else {
										sap.m.MessageToast.show("Failed to delete the record.");
									}
								})
								.catch((error) => {
									sap.m.MessageToast.show(
										"An error occurred: " + error.message
									);
								});
						}
					},
				});
			},
			refresh() {
				fetch("http://yw:8001/sow_candent_api/agreements/list/")
					.then((res) => res.json())
					.then((data) => {
						console.log(data);
						var oModel = {};
						oModel.agreements = {};
						oModel.agreements = data;
						oModel.filtered = {};
						oModel.filtered.All = oModel.agreements;
						oModel.filtered.MSA = oModel.agreements.filter(
							(i) => i.Type == "MSA"
						);
						oModel.filtered.SOW = oModel.agreements.filter(
							(i) => i.Type == "SOW"
						);
						oModel.filtered.NDA = oModel.agreements.filter(
							(i) => i.Type == "NDA"
						);
						oModel.filtered.EXP = oModel.agreements
							.filter((i) => i.Status === "Active")
							.filter((i) => {
								const diff = new Date(i.AgreementEndDate) - new Date();
								const remaining_days = Math.round(diff / (1000 * 60 * 60 * 24));
								if (remaining_days < 30) {
									return remaining_days;
								} else {
									return null;
								}
							});

						// oModel.status = {
						// 	active: oModel.agreements.filter((i) => i.Status === "Active")
						// 		.length,
						// 	inactive: oModel.agreements.filter(
						// 		(i) => i.Status === "Inactive"
						// 	).length,
						// };

						oModel.status = oModel.agreements
							.map((i) => i.Status)
							.getUnique()
							.map((name) => ({
								name,
								length: oModel.agreements.filter((i) => i.Status === name)
									.length,
								data: oModel.agreements.filter((i) => i.Status === name),
							}));

						// oModel.status = oModel.agreements.map()

						oModel.length = {};
						Object.keys(oModel.filtered).map(
							(i) => (oModel.length[i] = oModel.filtered[i].length)
						);
						oModel.start_date = {};
						oModel.end_date = {};
						oModel.start_date = new Date(
							Math.min(
								...oModel.agreements
									.map((agreement) =>
										new Date(agreement.AgreementStartDate).getTime()
									)
									.filter((date) => !isNaN(date))
							)
						);
						oModel.end_date = new Date(
							Math.max(
								...oModel.agreements
									.map((agreement) =>
										new Date(agreement.AgreementEndDate).getTime()
									)
									.filter((date) => !isNaN(date))
							)
						);

						this.getOwnerComponent().setModel(new JSONModel(oModel), "docs");

						console.log(this.getModel("docs"));

						console.log(
							"the fetch is working just fine and here is the data from api, ",
							data
						);

						sap.ui.core.BusyIndicator.hide();
					})
					.catch(console.error);
			},
		});
	}
);
