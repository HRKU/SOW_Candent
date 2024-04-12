sap.ui.define(
	[
		"sap/ui/core/mvc/Controller",
		"sap/ui/model/json/JSONModel",
		"sap/m/MessageToast", // Import MessageToast
		"com/candentech/sowtracker/enum/password",
		"sap/f/Card",
		"sap/m/Text",
		"../model/formatter",
		"sap/m/MessageBox",
		"com/candentech/sowtracker/enum/services",
	],
	function (
		Controller,
		JSONModel,
		MessageToast,
		ePassword,
		Card,
		Text,
		formatter,
		MessageBox,
		services
	) {
		"use strict";

		return Controller.extend("com.candentech.sowtracker.controller.Admin", {
			formatter: formatter,
			onInit: function () {
				var oModel = this.getOwnerComponent().getModel("userdetails");
				// console.log("this is oModel -- ", oModel);
			},
			onShowPasswordSelect: function (oEvent) {
				
				var oPasswordInput = oEvent.getSource();
				var temp = oPasswordInput.getValueHelpIconSrc().split("://");

				var state = temp.pop();

				temp.push(ePassword.opposite_state[state]);

				oPasswordInput.setType(ePassword.input_type[state]);
				oPasswordInput.setValueHelpIconSrc(temp.join("://"));
			},

			handleOpen: function () {
				this.qDialog ??= this.loadFragment({
					name: "com.candentech.sowtracker.view.Dialog",
				});

				this.qDialog.then((oDialog) => oDialog.open());
				this.byId("password").setVisible(true);
				this.byId("newpassword").setVisible(false);
				this.byId("confirmpassword").setVisible(false);
			},
			handleClose: function () {
				var oDialog = this.getView().byId("idDialog");

				var oDialog = this.byId("idDialog");
				oDialog.setTitle("Add new Roles");
				var oUsername = this.byId("username");
				var oRole = this.byId("role");
				this.byId("submit").setVisible(true);
				this.byId("save").setVisible(false);

				oUsername.setValue();
				oUsername.setEditable(true);
				oRole.setValue();
				oDialog.close();
			},

			onSubmit: function () {
				var oIds = ["username", "password", "role"];
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

				fetch(services.createUser, {
					method: "POST",
					body: JSON.stringify(valuesToBeSent),
				})
					.then((response) => {
						if (response.status == 201) {
							MessageToast.show("New User Create Successfully");
							this.refresh();
						} else {
							MessageToast.show("New User not created");
						}
						return response.json();
					})
					.then((data) => {})
					.catch((error) => {
						MessageToast.show("Something went Wrong " + error);
					});

				this.qDialog ??= this.loadFragment({
					name: "com.candenxtech.sowtracker.view.fragments.AddSowDialog",
					addToDependents: true,
				});

				for (var key in oControls) {
					if (oControls[key].getValue()) {
						oControls[key].setValue();
					}
				}

				this.qDialog.then((oDialog) => oDialog.close());
			},
			onEdit(oEvent) {
				const oBindingContext = oEvent.getSource().getBindingContext("users");
				const sPath = oBindingContext.getPath();
				const oModel = this.getView().getModel("users");
				const selectedUser = oModel.getProperty(sPath);

				this.getView().setModel(
					new sap.ui.model.json.JSONModel(selectedUser),
					"user"
				);

				this.qDialog ??= this.loadFragment({
					name: "com.candentech.sowtracker.view.Dialog",
				});

				this.qDialog
					.then((oDialog) => oDialog.open())
					.finally(() => {
						var oDialog = this.byId("idDialog");
						oDialog.setTitle("Edit User");
						this.byId("password").setVisible(false);
						this.byId("newpassword").setVisible(true);
						this.byId("confirmpassword").setVisible(true);
						var oUsername = this.byId("username");
						var oRole = this.byId("role");
						this.byId("submit").setVisible(false);
						this.byId("save").setVisible(true);

						oUsername.setValue(selectedUser.username);
						oUsername.setEditable(false);
						oRole.setValue(selectedUser.role);
					});
			},
			onSave: function (oEvent) {
				debugger;
				var oRole, oPassword;
				if (!this.byId("newpassword").getValue()) {
					this.byId("newpassword").setValueState("Error");
					this.byId("newpassword").setValueStateText("Please Input Value");
					return;
				}
				if (!this.byId("confirmpassword").getValue()) {
					this.byId("confirmpassword").setValueState("Error");
					this.byId("confirmpassword").setValueStateText("Please Input Value");
					return;
				}
				if (
					this.byId("confirmpassword").getValue() !=
					this.byId("newpassword").getValue()
				) {
					this.byId("confirmpassword").setValueState("Error");
					this.byId("confirmpassword").setValueStateText("Invalid Password");
					return;
				}
				oPassword = this.byId("newpassword").getValue();

				oRole = this.byId("role").getValue();

				const oData = this.getView().getModel("user").getData();
				var valuesTobeSent = {};
				valuesTobeSent["role"] = oRole;
				valuesTobeSent["id"] = oData.id;
				if (oPassword) {
					valuesTobeSent["password"] = oPassword;
				}

				fetch(services.createUser, {
					method: "PATCH",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(valuesTobeSent),
				})
					.then((response) => {
						if (!response.ok) {
							throw new Error("HTTP error " + response.status);
						}
						return response.json();
					})
					.then((data) => {
						MessageToast.show("User updated successfully");
						this.refresh();
					})
					.catch((error) => {
						MessageToast.show("Error updating user:", error);
						return;
					});

				this.qDialog ??= this.loadFragment({
					name: "com.candentech.sowtracker.view.Dialog",
				});
				this.qDialog.then((oDialog) => oDialog.close());
			},
			onDeleteButtonPress: function (oEvent) {
				var oModel = this.byId("gridList");
				const sPath = oEvent.getSource().getBindingContext("users").getPath();
				const { id: id } = oModel.getModel("users").getProperty(sPath);

				var that = this; // Store the reference to the controller instance

				MessageBox.confirm("Are you sure to delete the record?", {
					title: "Confirm",
					onClose: function (sAction) {
						if (sAction === "OK" && id) {
							fetch(services.createUser, {
								method: "DELETE",
								body: JSON.stringify({
									id: id,
								}),
							})
								.then((res) => {
									if (res.ok) {
										MessageToast.show("Record deleted successfully.");

										// Call refresh using the stored reference
										that.refresh();
									} else {
										MessageToast.show("Failed to delete the record.");
									}
								})
								.catch((error) => {
									MessageToast.show("An error occurred: " + error.message);
								});
						}
					},
				});
			},

			onEditButtonPress(oEvent) {
				var sPath = oEvent.getSource().getBindingContext("users").getPath();
			},

			refresh() {
				fetch(services.createUser)
					.then((res) => {
						if (!res.ok) {
							throw new Error("Network response was not ok");
						}
						return res.json();
					})
					.then((data) => {
						this.getOwnerComponent().setModel(new JSONModel(data), "users");
						console.log("Login fetch is working properly", data);
					})
					.catch((error) => {
						console.error(error);
					});
			},
		});
	}
);
