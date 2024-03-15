sap.ui.define([
	"sap/ui/core/mvc/Controller",
	'sap/ui/model/json/JSONModel'
], function(
	Controller,
	JSONModel
) {
	"use strict";

	return Controller.extend("com.candentech.sowtracker.controller.Admin", {


		handleOpen: function () {
			var oDialog = this.getView().byId("idDialog");
			oDialog.open();
		},

		handleClose: function () {
			var oDialog = this.getView().byId("idDialog");
			oDialog.close();
		},

		/**
		 * @override
		 */
		onInit: function() {
			var oData = {
				"ProductCollection": [
					{
						"ProductId": "HT-1001",
						"Name": "Select option 1"
					},
					{
						"ProductId": "HT-1002",
						"Name": "Lorem Ipsum is simply dummy text of the printing and typesetting industry."
					},
					{
						"ProductId": "HT-1003",
						"Name": "Select option 3"
					},
					{
						"ProductId": "HT-1007",
						"Name": "Select option 4"
					},
					{
						"ProductId": "HT-1010",
						"Name": "Select option 5"
					}
				]
			};
			var oModel = new JSONModel(oData);
			this.getView().setModel(oModel);
		
		}
	});
});