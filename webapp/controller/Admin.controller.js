sap.ui.define([
			"sap/ui/core/mvc/Controller",
			'sap/ui/model/json/JSONModel',
			"com/candentech/sowtracker/enum/password",
			"sap/f/Card",
			"sap/m/MessageToast",
			"sap/m/Text"
		], function (
			Controller,
			MessageToast,
			JSONModel,
			ePassword,
			Card,
			Text
		) {
			"use strict";

			return Controller.extend("com.candentech.sowtracker.controller.Admin", {

					// onChange: function(oEvent) {
					// 	var selectedItem = oEvent.getParameter("selectedItem");
					// 	var selectedKey = selectedItem.getKey();
					// 	// Do something with the selected key
					// 	console.log("Selected Key: ", selectedKey);
					//   }
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

					/**
					 * @override
					 */
					onInit: function () {

					},
					onShowPassword: function () {
						var oPasswordInput = this.byId("idPassword");
						var temp = oPasswordInput.getValueHelpIconSrc().split("://");

						var state = temp.pop();

						temp.push(ePassword.opposite_state[state]);

						oPasswordInput.setType(ePassword.input_type[state]);
						oPasswordInput.setValueHelpIconSrc(temp.join("://"));
					},

					onDeleteButtonPress: function (oEvent) {
						debugger;
						// oEvent.oSource.oPropagatedProperties.oBindingContexts.usersData.sPath
					}
					});
			});