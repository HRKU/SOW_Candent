sap.ui.define(
	['sap/ui/core/mvc/Controller', 'sap/ui/model/json/JSONModel'],
	/**
	 * @param {typeof sap.ui.core.mvc.Controller} Controller
	 */
	function (Controller, JSONModel) {
		'use strict';

		return Controller.extend('com.candentech.sowtracker.controller.Admin', {
			onInit: function () {
				let oModel = new JSONModel({});

				// Load roles from local JSON file
				$.getJSON('../Roles.json', function (roles) {
					oModel.setProperty('/roles', roles);
				});

				this.getView().setModel(oModel);

				// ... other logic from previous response
			},
			createRole: function () {
				this.pDialog ??= this.loadFragment({
					name: 'com.candentech.sowtracker.view.AddRole',
				});

				this.pDialog.then((oDialog) => oDialog.open());
			},

			onCancelRolePress: function () {
				let oDialog = this.byId('addRoleDialog');

				if (oDialog) {
					oDialog.close();
				}
			},
		});
	},
);
