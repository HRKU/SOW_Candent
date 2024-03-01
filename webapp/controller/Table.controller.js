sap.ui.define(
	["sap/ui/core/mvc/Controller", "sap/ui/model/json/JSONModel"],
	(Controller, JSONModel) => {
		"use strict";

		return Controller.extend("com.candentech.sowtracker.controller.Table", {
			onInit: function () {
				// fetch("http://excavator:8000/sow_candent_api/agreementdetails/")
				// 	.then((res) => res.json())
				// 	.then((data) => {
				// 		console.log(data);
				// 		this.getView().setModel(
				// 			new JSONModel(data),
				// 			"products"
				// 		);
				// 	})
				// 	.catch(console.error);
			},
			onOpenDialog() {
				// create dialog lazily
				this.pDialog ??= this.loadFragment({
					name: "com.candentech.sowtracker.view.AddSowDialog",
				});

				this.pDialog.then((oDialog) => oDialog.open());
			},
			onCloseDialog() {
				this.byId("idAddSowDialog").close();
				var clientNameInput = this.getView().byId("idInpCltName");
				var projectNameInput = this.getView().byId("idInpPrjName");
				var documentTypeInput = this.getView().byId("idInpAssgn");
				var startDatePicker = this.getView().byId("idStartDatePicker");
				var endDatePicker = this.getView().byId("idEndDatePicker");
				var projectStatusInput = this.getView().byId("idInpSts");
				var projectTypeInput = this.getView().byId("idInpPrjType");

				// Clear the values of the input fields
				clientNameInput.setValue("");
				projectNameInput.setValue("");
				documentTypeInput.setValue("");
				startDatePicker.setValue("");
				endDatePicker.setValue("");
				projectStatusInput.setValue("");
				projectTypeInput.setValue("");

				// Clear validation states
				clientNameInput.setValueState(sap.ui.core.ValueState.None);
				projectNameInput.setValueState(sap.ui.core.ValueState.None);
				documentTypeInput.setValueState(sap.ui.core.ValueState.None);
				startDatePicker.setValueState(sap.ui.core.ValueState.None);
				endDatePicker.setValueState(sap.ui.core.ValueState.None);
				projectStatusInput.setValueState(sap.ui.core.ValueState.None);
				projectTypeInput.setValueState(sap.ui.core.ValueState.None);
			},

			onsubmit() {
				var clientNameInput = this.getView().byId("idInpCltName");
				var projectNameInput = this.getView().byId("idInpPrjName");
				var documentTypeInput = this.getView().byId("idInpAssgn");
				var startDatePicker = this.getView().byId("idStartDatePicker");
				var endDatePicker = this.getView().byId("idEndDatePicker");
				var projectStatusInput = this.getView().byId("idInpSts");
				var projectTypeInput = this.getView().byId("idInpPrjType");

				var clientName = clientNameInput.getValue();
				var projectName = projectNameInput.getValue();
				var documentType = documentTypeInput.getValue();
				var startDate = startDatePicker.getValue();
				var endDate = endDatePicker.getValue();
				var projectStatus = projectStatusInput.getValue();
				var projectType = projectTypeInput.getValue();

				// Reset previous error states
				clientNameInput.setValueState(sap.ui.core.ValueState.None);
				projectNameInput.setValueState(sap.ui.core.ValueState.None);
				documentTypeInput.setValueState(sap.ui.core.ValueState.None);
				startDatePicker.setValueState(sap.ui.core.ValueState.None);
				endDatePicker.setValueState(sap.ui.core.ValueState.None);
				projectStatusInput.setValueState(sap.ui.core.ValueState.None);
				projectTypeInput.setValueState(sap.ui.core.ValueState.None);

				// Check if any of the required fields are empty
				if (!clientName) {
					clientNameInput.setValueState(sap.ui.core.ValueState.Error);
					clientNameInput.setValueStateText(
						"Please enter a client name"
					);
					return;
				}
				if (!projectName) {
					projectNameInput.setValueState(
						sap.ui.core.ValueState.Error
					);
					projectNameInput.setValueStateText(
						"Please enter a project name."
					);
					return;
				}
				if (!projectStatus) {
					projectStatusInput.setValueState(
						sap.ui.core.ValueState.Error
					);
					projectStatusInput.setValueStateText(
						"Plaese select project status"
					);
					return;
				}
				if (!projectType) {
					projectTypeInput.setValueState(
						sap.ui.core.ValueState.Error
					);
					projectTypeInput.setValueStateText(
						"Please select project type"
					);
					return;
				}
				if (!documentType) {
					documentTypeInput.setValueState(
						sap.ui.core.ValueState.Error
					);
					documentTypeInput.setValueStateText(
						"Please enter an documentType."
					);
					return;
				}
				if (!startDate) {
					startDatePicker.setValueState(sap.ui.core.ValueState.Error);
					startDatePicker.setValueStateText(
						"Please select a start date."
					);
					return;
				}
				if (!endDate) {
					endDatePicker.setValueState(sap.ui.core.ValueState.Error);
					endDatePicker.setValueStateText(
						"Please select an end date."
					);
					return;
				}

				// Check if end date is greater than start date
				var startDateObj = new Date(startDate);
				var endDateObj = new Date(endDate);
				if (endDateObj <= startDateObj) {
					endDatePicker.setValueState(sap.ui.core.ValueState.Error);
					endDatePicker.setValueStateText(
						"End date must be greater than start date."
					);
					return;
				}

				// All validations passed, proceed with form submission
				var formData = JSON.stringify({
					clientName: clientName,
					projectName: projectName,
					documentType: documentType,
					startDate: startDate,
					endDate: endDate,
					projectStatus: projectStatus,
					projectType: projectType,
				});

				// Send formData to the dummy API endpoint
				// this.sendDataToDummyAPI(formData);
				console.log(formData);
				this.byId("idAddSowDialog").close();
			},
		});
	}
);
