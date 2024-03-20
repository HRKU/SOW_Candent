sap.ui.define(
	[
		"sap/ui/core/mvc/Controller",
		"sap/ui/model/json/JSONModel",
		"com/candentech/sowtracker/enum/password",
		"sap/f/Card",
		"sap/m/MessageToast",
		"sap/m/Text",
	],
	function (Controller, JSONModel, ePassword, Card, MessageToast, Text) {
		"use strict";

		return Controller.extend("com.candentech.sowtracker.controller.Admin", {

			// onChange: function(oEvent) {
			// 	var selectedItem = oEvent.getParameter("selectedItem");
			// 	var selectedKey = selectedItem.getKey();
			// 	// Do something with the selected key
			// 	console.log("Selected Key: ", selectedKey);
			//   }

			onInputChange: console.log,
			handleOpen: function () {
				this.qDialog ??= this.loadFragment({
					name: "com.candentech.sowtracker.view.Dialog",
				});

				this.qDialog.then((oDialog) => oDialog.open());
			},
			handleClose: function () {
				var oDialog = this.getView().byId("idDialog");
				oDialog.close();
			},


			onSubmit: function () {
				debugger;
				var oIds = ["username", "password", "role"];
				var oControls = {};
				var valuesToBeSent = {};
				var oMessageToast = new MessageToast();

				oIds.map((id) => {
					oControls[id] = this.byId(id);
					console.log(oControls)
				})

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
				console.log(valuesToBeSent)

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
					addToDependents: true
				});

				for (var key in oControls) {
					if (oControls[key].getValue()) {
						oControls[key].setValue();
					}
				}

				this.qDialog.then((oDialog) => oDialog.close());
			},
			onEditButtonPress: function (oEvent) {
				
				const oBindingContext = oEvent.getSource().getBindingContext("users");
				// const oBindingContext = oEvent.getSource().getBindingContext("users");
				const sPath = oBindingContext.getPath();
				console.log(sPath)
				const oModel = this.getView().getModel("users");
				console.log(oModel)
				const selectedUser = oModel.getProperty(sPath);

				console.log(selectedUser);
				// this.getView().setModel(new JSONModel(selectedUser), "user")
				this.qDialog ??= this.loadFragment({
					name: "com.candentech.sowtracker.view.Dialog",
				});

				this.qDialog.then((oDialog) => oDialog.open());
				setTimeout(() => {
					// debugger
					var oDialog = this.byId("idDialog")
					oDialog.setTitle("Edit User")
					var oUsername = this.byId("username")
					var oRole = this.byId("role")
					this.byId("_IDGenButton1").setVisible(false)
					this.byId("_IDGenButton3").setVisible(true)
					
					console.log(oUsername)
					oUsername.setValue(selectedUser.username)
					oUsername.setEditable(false)
					oRole.setValue(selectedUser.role)
					
					
				}, 10);

				// this.aDialog ??= this.loadFragment({
				// 	name: "com.candentech.sowtracker.view.EditRole",
				// 	id: "EditRoleDialog",
				// 	addToDependents: true
				// })
				// this.aDialog.then((oDialog) => {

				// 	oDialog.bindElement("sPath", oBindingContext.getPath())
				// 	oDialog.open()
				// 	var userNameInput = this.getView().byId("username")
				// 	debugger;
				// });




			},
			onSubmitButtonPress: function (oEvent) {
				debugger
				// this.aDialog ??= this.loadFragment({
				// 	name: "com.candentech.sowtracker.view.EditRole",
				// 	id: "EditRoleDialog",
				// });
				const oBindingContext = oEvent.getSource().getBindingContext("users");
				const sPath = oBindingContext.getPath();

				const oModel = this.getView().getModel("user");
				const selectedUser = oModel.getProperty(sPath);


				this.aDialog.then((oDialog) => {
					oDialog.attachEventOnce("submit", (oEvent) => {
						// const newUsername = oEvent.getParameter("newUsername");
						const newPassword = oEvent.getParameter("newPassword");
						const newRole = oEvent.getParameter("newRole");

						// oModel.setProperty(sPath + "/username", newUsername);
						oModel.setProperty(sPath + "/password", newPassword);
						oModel.setProperty(sPath + "/role", newRole);

						console.log(newRole);

						fetch("http://yw:8001/sow_candent_api/userapi/", {
								method: "PATCH",
								headers: {
									"Content-Type": "application/json"
								},
								body: JSON.stringify({
									id: selectedUser.id,
									password: newPassword,
									role: newRole,
								})
							})
							.then((response) => {
								if (!response.ok) {
									throw new Error("HTTP error " + response.status);
								}
								return response.json();
							})
							.then((data) => {
								console.log("User updated successfully", data);
								oDialog.close();
							})
							.catch((error) => {
								console.error("Error updating user:", error);
							});
					});
				});

				this.aDialog.then((oDialog) => oDialog.close());

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
				// oEvent.oSource.oPropagatedProperties.oBindingContexts.usersData.sPath
			},
		});
	}
);