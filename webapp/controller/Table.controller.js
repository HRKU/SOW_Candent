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
			//in the init function we  dynamically generate the  table and  its various fields columns
			onInit: function () {
				const oModel = this.getOwnerComponent().getModel("docs");
				const oLabels = [
					"Sr No",
					"Company Name",
					"Type",
					"Agreement No",
					"Project Name",
					"Agreement Date",
					"Agreement Start Date",
					"Agreement End Date",
					"Project Type",
					"Status",
				];

				var oTable = this.byId("projectTable");
				var oCell = [];

				oLabels.map((i) => {
					var oColumn;
					var cell1;

					if (i === "Status") {
						oColumn = new sap.m.Column("col" + i, {
							header: new sap.m.Label({
								text: i,
							}),
						});

						cell1 = new sap.m.Switch({
							id: "statusSwitch",
							state: {
								path: "docs>" + i,
								formatter: function (status) {
									return status === "Active";
								},
							},
							enabled: {
								path: "userdetails>/role",
								formatter: function (role) {
									return role === "editor" || role === "admin";
								},
							},
							change: this.onStatusChange.bind(this),
							customTextOn: "Active",
							customTextOff: "Inactive",
						});
						cell1.addStyleClass("classSwitch");
					} else {
						if (i == "Sr No") {
							oColumn = new sap.m.Column("col" + i.split(" ").join(""), {
								header: new sap.m.Label({
									text: i,
								}),
							});

							cell1 = new sap.m.Text({
								text: "{docs>id}",
							});
						} else {
							oColumn = new sap.m.Column("col" + i.split(" ").join(""), {
								header: new sap.m.Label({
									text: i,
								}),
							});

							cell1 = new sap.m.Text({
								text: "{docs>" + i.split(" ").join("") + "}",
							});
						}
					}

					oCell.push(cell1);
					oTable.addColumn(oColumn);
				});

				var aColList = new sap.m.ColumnListItem("aColList", {
					cells: oCell,
				});
				this.ColumnList = aColList;
				oTable.setModel(oModel);
				var oSorter = new sap.ui.model.Sorter("CompanyName", false, true);
				oTable.bindItems({
					path: "docs>/agreements",
					template: aColList,
					sorter: oSorter,
				});
				var sRole = this.getOwnerComponent()
					.getModel("userdetails")
					.getProperty("/role");
				if (sRole === "viewer") {
					oTable.setMode("None");
				} else {
					oTable.setMode("MultiSelect");
				}
			},
			// opens Sorter PopUp
			handleOpenDialog: async function () {
				this.oDialog ??= await this.loadFragment({
					name: "com.candentech.sowtracker.view.fragments.Sorter",
				});

				this.oDialog.open();
			},
			// deals with single Status Changes
			onStatusChange: function (oEvent) {
				var bState = oEvent.getParameter("state");

				var oContext = oEvent.getSource().getBindingContext("docs");
				var oData = oContext.getObject();

				oData.Status = bState ? "Active" : "Inactive";

				fetch(services.update, {
					method: "PATCH",
					body: JSON.stringify(oData),
				})
					.then((response) => {
						if (response.ok) {
							MessageToast.show("Status updated successfully");
							this.refresh();
						} else {
							MessageToast.show("Failed to update status");
						}
					})
					.catch((error) => {
						MessageToast.show("Something went wrong: " + error);
					});
			},
			// Filters when filter is enabled
			onFilter: function () {
				// Retrieve the filter values from SearchFields and ComboBox
				var sType = this.byId("type").getValue();
				var sCompanyName = this.byId("companyName").getValue();
				var sProjectName = this.byId("projectName").getValue();
				var sStatus = this.byId("status").getValue();

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
				var oTable = this.byId("projectTable");
				var oBinding = oTable.getBinding("items");
				oBinding.filter(aFilters);
			},
			//allows download of template
			onDownloadTemplate: function () {
				var filename = "template.xlsx";
				var fileUrl = "Assets/" + filename;

				fetch(fileUrl)
					.then((response) => response.blob())
					.then((blob) => {
						var a = document.createElement("a");
						var url = window.URL.createObjectURL(blob);
						a.href = url;
						a.download = filename;
						document.body.appendChild(a);
						a.click();
						window.URL.revokeObjectURL(url);
						document.body.removeChild(a);
					})
					.catch((error) => {
						console.error("Error downloading file:", error);
					});
			},
			//this handles sorter "OK" Button to sort,group,Filter
			handleConfirm(oEvent) {
				debugger;
				// console.log(oEvent);
				var sGroupName = "";
				var sFilter = "";
				const oParameters = oEvent.getParameters();
				const sSortName = oParameters.sortItem.getText();
				const bSort = oParameters.sortDescending;
				if (oParameters.presetFilterItem) {
					sFilter = oParameters.presetFilterItem.getText();
					this.byId(sFilter).setVisible(true);
				}
				if (oParameters.groupItem) {
					sGroupName = oParameters.groupItem.getText();
					const bGroup = oParameters.groupDescending;
					var oSorter = [
						new sap.ui.model.Sorter(sGroupName, bGroup, Boolean(sGroupName)),
						new sap.ui.model.Sorter(sSortName, bSort, null),
					];
				} else {
					sGroupName = null;
					var oSorter = new sap.ui.model.Sorter(sSortName, bSort, null);
				}
				var oTable = this.byId("projectTable");
				oTable.bindItems({
					path: "docs>/agreements",
					template: this.ColumnList,
					sorter: oSorter,
				});
			},
			// Clear the values of SearchFields and ComboBox
			onClearFilter: function () {
				var oType = this.byId("type");
				var oCompanyName = this.byId("companyName");
				var oProjectName = this.byId("projectName");
				var oStatus = this.byId("status");
				oType.setValue("");
				oCompanyName.setValue("");
				oProjectName.setValue("");
				oStatus.setSelectedKey("");
				oType.setVisible(false);
				oCompanyName.setVisible(false);
				oProjectName.setVisible(false);
				oStatus.setVisible(false);
				var oTable = this.byId("projectTable");
				var oBinding = oTable.getBinding("items");
				// console.log(oBinding);
				oBinding.filter([]);
			},
			//Opens Create  dialog
			onOpenDialog() {
				this.pDialog ??= this.loadFragment({
					name: "com.candentech.sowtracker.view.fragments.AddSowDialog",
				});

				this.pDialog.then((oDialog) => oDialog.open());
				setTimeout(() => {
					var oDialog = this.byId("idAddAndEditSowDialog");
					// console.log(oDialog);
					oDialog.setTitle("Add New Entry");
					this.byId("idEdtBtn").setVisible(false);
					this.byId("idSbtBtn").setVisible(true);
				}, 50);
			},
			//CLoses Create User/Edit user dialog
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
			//Submits the Create Dialog
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
			//submits Edit dialog box
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
				debugger;

				// var iSrNo = oSelectedItem.getCells()[0].getText();
				var oModel = oSelectedItem.getModel("docs");
				var iSrNo = oModel.getProperty(
					oSelectedItem.getBindingContextPath()
				).SrNo;

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

				fetch(services.update, {
					method: "PATCH",
					body: JSON.stringify(valuesToBeSent),
				})
					.then((res) => res.json())
					.then((data) => {
						debugger;
						// console.log(data);
						if (data.message) {
							// console.log(data);
							MessageToast.show(data.message);

							oModel.setProperty(
								oSelectedItem.getBindingContextPath(),
								valuesToBeSent
							);
							this.getView().getModel("docs").refresh(true);
							this.refresh();
						} else {
							MessageToast.show("Failed to update fields");
						}
					})
					.catch((error) => {
						MessageToast.show("Something went wrong: " + error);
					});

				for (var key in oControls) {
					if (oControls[key].getValue()) {
						oControls[key].setValue();
					}
				}
				this.refresh();
				this.onClearFilter();

				var oDialog = this.byId("idAddAndEditSowDialog");
				if (oDialog) {
					oDialog.close();
				}
			},
			// opens Edit Dialog box
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
						debugger;
						var items = oSelectedRow
							.getCells()
							.map((i) =>
								!i.aCustomStyleClasses
									? i.getText()
									: i.getState()
									? "Active"
									: "Inactive"
							);
						items.shift();
						oIds.map((id, index) => this.byId(id).setValue(items[index]));
					}

					oDialog.setTitle("Edit Fields");
					this.byId("idSbtBtn").setVisible(false);
					this.byId("idEdtBtn").setVisible(true);
				}, 50);
			},
			//Deals with File Upload
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
								MessageToast.show(data.error);
								throw new Error("Error uploading file");
							}
							return response.json();
						})
						.then((data) => {
							MessageToast.show(data.message);
							// console.log("File uploaded successfully:", data);
							this.refresh();
						})
						.catch((error) => {
							console.error("Error uploading file:", error);
						});
				} else {
					sap.m.MessageToast.show("No file selected");
				}
				oEvent.getSource().clear();
			},
			//Deals with Deletion of fields in table
			onDelete() {
				const oTable = this.byId("projectTable");
				const oSelectedItems = oTable.getSelectedItems();

				if (oSelectedItems.length === 0) {
					MessageToast.show("Please select the Record(s) to delete");
					return;
				}
				debugger;

				const srNoMap = oSelectedItems.map((aSelectedItem) => {
					const sPath = aSelectedItem.getBindingContext("docs").getPath();
					const { SrNo: iSrNo } = aSelectedItem
						.getModel("docs")
						.getProperty(sPath);
					return iSrNo;
				});

				MessageBox.confirm(
					`Are you sure to delete ${oSelectedItems.length} record(s)?`,
					{
						title: "Confirm",
						onClose: (sAction) => {
							if (sAction === "OK") {
								fetch(services.delete, {
									method: "DELETE",
									body: JSON.stringify(srNoMap),
								})
									.then((res) => res.json())
									.then((data) => {
										debugger;
										if (data) {
											sap.m.MessageToast.show(
												data.message.replace("updated", "deleted")
											);
										} else {
											sap.m.MessageToast.show("Failed to delete the record.");
										}
									})
									.catch((error) => {
										debugger;
										sap.m.MessageToast.show(
											"An error occurred: " + error.message
										);
									});
							}
							this.refresh();
						},
					}
				);
			},
			// live refresh of page
			refresh() {
				var count = 1;
				var prevCompanyName = "";
				fetch(services.agreementList)
					.then((res) => res.json())
					.then((data) => {
						// console.log(data);
						data
							.sort((a, b) => a.CompanyName.localeCompare(b.CompanyName))
							.forEach((item) => {
								if (item.CompanyName !== prevCompanyName) {
									count = 1;
									prevCompanyName = item.CompanyName;
								}
								item.id = count;
								count++;
							});

						var oModel = {};
						oModel.agreements = {};
						oModel.agreements = data;
						console.log(oModel.agreements);
						oModel.goingToExpire = {};
						oModel.goingToExpire = oModel.agreements
							.filter((i) => i.Status == "Active")
							.filter((i) => {
								const diff = new Date(i.AgreementEndDate) - new Date();
								const remaining_days = Math.round(diff / (1000 * 60 * 60 * 24));
								if (remaining_days < 31 && remaining_days > -16) {
									return remaining_days;
								} else {
									return null;
								}
							});
						oModel.ExpLen = {};
						oModel.ExpLen = oModel.goingToExpire.length;
						oModel.filtered = {};
						oModel.filtered.types = oModel.agreements
							.map((i) => i.Type)
							.getUnique()
							.map((name) => ({
								name,
							}))
							.concat({ name: "EXPIRED" });
						oModel.filtered.len = {};
						oModel.filtered.types.forEach((type) => {
							oModel.filtered[type.name] = oModel.goingToExpire
								.filter((i) => i.Status == "Active")
								.filter((i) => i.Type == type.name)
								.filter((i) => {
									if (i) {
										const diff = new Date(i.AgreementEndDate) - new Date();
										const remaining_days = Math.round(
											diff / (1000 * 60 * 60 * 24)
										);
										return remaining_days > 0 && remaining_days < 31;
									}
								});
						});
						oModel.filtered.EXPIRED = oModel.goingToExpire.filter((i) => {
							const diff = new Date(i.AgreementEndDate) - new Date();
							const remaining_days = Math.round(diff / (1000 * 60 * 60 * 24));
							if (remaining_days <= 0 && remaining_days > -16) {
								return remaining_days;
							} else {
								return null;
							}
						});
						Object.keys(oModel.filtered.types).forEach((key) => {
							const typeKey = oModel.filtered.types[key].name;
							if (oModel.filtered[typeKey].length) {
								oModel.filtered.len[key] = {
									type: typeKey,
									len: oModel.filtered[typeKey].length,
								};
							}
						});
						oModel.Status = oModel.agreements
							.map((i) => i.Status)
							.getUnique()
							.map((name) => ({
								name,
								length: oModel.agreements.filter((i) => i.Status === name)
									.length,
								data: oModel.agreements.filter((i) => i.Status === name),
							}));
						oModel.CompanyName = oModel.agreements
							.map((i) => i.CompanyName)
							.getUnique()
							.map((name) => ({
								name,
								length: oModel.agreements.filter((i) => i.CompanyName === name)
									.length,
								data: oModel.agreements.filter((i) => i.CompanyName === name),
							}));
						oModel.ProjectName = oModel.agreements
							.map((i) => i.ProjectName)
							.getUnique()
							.map((name) => ({
								name,
								length: oModel.agreements.filter((i) => i.ProjectName === name)
									.length,
								data: oModel.agreements.filter((i) => i.ProjectName === name),
							}));
						oModel.Type = oModel.agreements
							.map((i) => i.Type)
							.getUnique()
							.map((name) => ({
								name,
								length: oModel.agreements.filter((i) => i.Type === name).length,
								data: oModel.agreements.filter((i) => i.Type === name),
							}));
						oModel.ProjectType = oModel.agreements
							.map((i) => i.ProjectType)
							.getUnique()
							.map((name) => ({
								name,
								length: oModel.agreements.filter((i) => i.ProjectType === name)
									.length,
								data: oModel.agreements.filter((i) => i.ProjectType === name),
							}));
						oModel.AllLen = {};
						oModel.AllLen = oModel.agreements.length;
						this.getView().getParent().setModel(new JSONModel(oModel), "docs");
						// console.log(
						// 	"the fetch is working just fine and here is the data from api, ",
						// 	data
						// );
						sap.ui.core.BusyIndicator.hide();
					})
					.catch(console.error);
			},
		});
	}
);
