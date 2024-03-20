/**
 * @override
 */

sap.ui.define(
	[
		"sap/ui/core/mvc/Controller",
		"sap/ui/model/json/JSONModel",
		"com/candentech/sowtracker/enum/password",
		"sap/f/Card",
		"sap/m/MessageToast",
		"sap/m/Text",
		"../model/formatter",
		"sap/m/MessageBox",
		"com/candentech/sowtracker/enum/services",
	],
	function (
		Controller,
		MessageToast,
		JSONModel,
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
				console.log("this is oModel -- ", oModel);
				// if (oModel == "admin") {
				// 	fetch("http://yw:8000/sow_candent_api/userapi/")
				// 		.then((res) => res.json())
				// 		.then((data) => {
				// 			console.log(data);
				// 			// var usersData= [];
				// 			// var oModel = {};
				// 			// this.setModel(new JSONModel(oModel), "users");
				// 			// console.log(this.getModel("users"));
				// 			this.getView().setModel(new JSONModel(data), "users");
				// 			console.log("Login fetch is working poperly", data);
				// 		})
				// 		.catch((error) => {
				// 			console.error;
				// 			sap.ui.core.BusyIndicator.hide();
				// 		});
				// }
			},
			handleOpen: function () {
				this.qDialog ??= this.loadFragment({
					name: "com.candentech.sowtracker.view.Dialog",
				});

				this.qDialog.then((oDialog) => oDialog.open());
			},
			handleClose: function () {
				var oDialog = this.getView().byId("idDialog");

				setTimeout(() => {
					// debugger
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
				}, 50);
			},

			onSubmit: function () {
				debugger;
				var oIds = ["username", "password", "role"];
				var oControls = {};
				var valuesToBeSent = {};
				var oMessageToast = new MessageToast();

				oIds.map((id) => {
					oControls[id] = this.byId(id);
					console.log(oControls);
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
				console.log(valuesToBeSent);

				fetch(services.creatUser, {
					method: "POST",
					body: JSON.stringify(valuesToBeSent),
				})
					.then((response) => {
						if (response.status == 201) {
							oMessageToast.show("New User Create Successfully");
						} else {
							oMessageToast.show("New User not created");
						}
						return response.json();
					})
					.then((data) => {
						console.log(data);
					})
					.catch((error) => {
						oMessageToast.show("Something went Wrong " + error);
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
				// const oBindingContext = oEvent.getSource().getBindingContext("users");
				const sPath = oBindingContext.getPath();
				console.log(sPath);
				const oModel = this.getView().getModel("users");
				console.log(oModel);
				const selectedUser = oModel.getProperty(sPath);

				this.getView().setModel(
					new sap.ui.model.json.JSONModel(selectedUser),
					"user"
				);

				this.qDialog ??= this.loadFragment({
					name: "com.candentech.sowtracker.view.Dialog",
				});

				this.qDialog.then((oDialog) => oDialog.open());
				setTimeout(() => {
					// debugger
					var oDialog = this.byId("idDialog");
					oDialog.setTitle("Edit User");
					var oUsername = this.byId("username");
					var oRole = this.byId("role");
					this.byId("submit").setVisible(false);
					this.byId("save").setVisible(true);

					console.log(oUsername);
					oUsername.setValue(selectedUser.username);
					oUsername.setEditable(false);
					oRole.setValue(selectedUser.role);
				}, 50);

				console.log(selectedUser);
			},
			onSave: function (oEvent) {
				debugger;

				var oRole, oPassword;
				oPassword = this.byId("password").getValue();
				oRole = this.byId("role").getValue();

				const oData = this.getView().getModel("user").getData();
				console.log(oData);
				var valuesTobeSent = {};
				valuesTobeSent["role"] = oRole;
				valuesTobeSent["id"] = oData.id;
				if (oPassword) {
					valuesTobeSent["password"] = oPassword;
				}
				console.log(valuesTobeSent);

				fetch("http://yw:8001/sow_candent_api/userapi/", {
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
						console.log("User updated successfully", data);
					})
					.catch((error) => {
						console.error("Error updating user:", error);
						return;
					});

				this.qDialog ??= this.loadFragment({
					name: "com.candentech.sowtracker.view.Dialog",
				});
				this.qDialog.then((oDialog) => oDialog.close());
			},
			// onCloseButtonPress: function () {
			// 	this.aDialog ??= this.loadFragment({
			// 		name: "com.candentech.sowtracker.view.EditRole",
			// 		id: "EditRoleDialog",
			// 		addToDependents: true
			// 	});

			// 	this.aDialog.then((oDialog) => oDialog.close());

			// },

			/**
			 * @override
			 */
			onInit: function () {},
			// onShowPasswordSelect: function () {
			// 	debugger;
			// 	var oPasswordInput = this.byId("idPassword");
			// 	var temp = oPasswordInput.getValueHelpIconSrc().split("://");

			// 	var state = temp.pop();

			// 	temp.push(ePassword.opposite_state[state]);

			// 	oPasswordInput.setType(ePassword.input_type[state]);
			// 	oPasswordInput.setValueHelpIconSrc(temp.join("://"));
			// },

			onDeleteButtonPress: function (oEvent) {
				debugger;
				var oModel = this.byId("gridList");
				const sPath = oEvent.getSource().getBindingContext("users").getPath();
				const { id: id } = oModel.getModel("users").getProperty(sPath);

				MessageBox.confirm("Are you sure to delete the record?", {
					title: "Confirm",
					onClose: function (sAction) {
						if (sAction === "OK" && id) {
							fetch("http://yw:8001/sow_candent_api/userapi/", {
								method: "DELETE",
								body: JSON.stringify({
									id: id,
								}),
							})
								.then((res) => {
									if (res.ok) {
										sap.m.MessageToast.show("Record deleted successfully.");
										// oTable.removeItem(oSelectedItem);
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
			onEditButtonPress(oEvent) {
				var sPath = oEvent.getSource().getBindingContext("users").getPath();
			},
		});
	}
);
