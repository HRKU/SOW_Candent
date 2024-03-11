sap.ui.define(
	[
		"sap/ui/core/mvc/Controller",
		"sap/ui/model/json/JSONModel",
		"sap/m/MessageToast",
		"sap/m/MessageBox",
		"com/candentech/sowtracker/enum/services",
	],
	(Controller, JSONModel, MessageToast, MessageBox, services) => {
		"use strict";

		return Controller.extend("com.candentech.sowtracker.controller.Table", {
			onInit: function () {
				// const oModel = JSONModel("project.json");
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
					"docs>/agreements", // Adjust path as per your model structure
					aColList
				);
			},
			onOpenDialog() {
				this.pDialog ??= this.loadFragment({
					name: "com.candentech.sowtracker.view.AddSowDialog",
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
				this.pDialog ??= this.loadFragment({
					name: "com.candentech.sowtracker.view.AddSowDialog",
				});

				this.pDialog.then((oDialog) => oDialog.close());
			},
			onSubmit() {
				debugger;
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
					name: "com.candenxtech.sowtracker.view.AddSowDialog",
				});

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

				var iSrNo = this.byId("projectTable")
					.getSelectedItem()
					.getCells()[0]
					.getText();
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

				fetch("http://excavator:8000/sow_candent_api/agreements/update/", {
					method: "PUT",
					body: JSON.stringify(valuesToBeSent),
				})
					.then((response) => {
						// console.log(response.json());
						if (response.status == 200) {
							MessageToast.show("Updated Succesfully");
						} else {
							MessageToast.show("Did not Update fields");
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

			onOpenEdit() {
				this.pDialog ??= this.loadFragment({
					name: "com.candentech.sowtracker.view.AddSowDialog",
				});
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
					var oSelectedRow = this.byId("projectTable").getSelectedItem();
					if (oSelectedRow) {
						// Check if a row is selected
						var items = oSelectedRow.getCells().map((i) => i.getText());
						items.shift(); // Remove first item (presumably ID or index)
						oIds.map((id, index) => this.byId(id).setValue(items[index])); // Populate input fields with data from the selected row
					}

					oDialog.setTitle("Edit Fields");
					this.byId("idSbtBtn").setVisible(false);
					this.byId("idEdtBtn").setVisible(true);
				}, 50);
			},

			onFileUpload(oEvent) {
				var oFile = oEvent.getParameter("files")[0]; // Get the first file if multiple is false

				if (oFile) {
					var formData = new FormData();
					formData.append("excel_file", oFile); // Append the file with the key "excel_file"

					// Assuming you have an API endpoint named "/upload" for file upload
					fetch("http://excavator:8000/sow_candent_api/upload_excel/", {
						method: "POST",
						body: formData,
					})
						.then((response) => {
							if (!response.ok) {
								throw new Error("Error uploading file");
							}
							return response.json(); // Assuming the server returns JSON response
						})
						.then((data) => {
							// Handle successful upload
							console.log("File uploaded successfully:", data);
						})
						.catch((error) => {
							// Handle upload error
							console.error("Error uploading file:", error);
						});
				} else {
					sap.m.MessageToast.show("No file selected");
				}
			},

			onDelete() {
				debugger;
				const oTable = this.byId("projectTable");
				const oSelectedItem = oTable.getSelectedItem();
				const sPath = oSelectedItem.getBindingContext("docs").getPath();
				const { SrNo: iSrNo } = oSelectedItem
					.getModel("docs")
					.getProperty(sPath);
				window.oTable = oTable;
				// debugger;
				// Check whether the data are selected or not
				if (!oSelectedItem) {
					MessageToast.show("Please select the at least one Record!");
					return;
				}

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
		});
	}
);
