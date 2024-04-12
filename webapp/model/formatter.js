sap.ui.define([], () => {
	"use strict";

	return {
		SrnoIncrement(data) {
			var oModel = this.getOwnerComponent()
				.getModel("docs")
				.getData().agreements;
			for (let i = 0; i < oModel.length; i++) {
				if (oModel[i].SrNo === data) {
					return ++i;
				}
			}
			return 0;
		},
		makeObject(date) {
			Object.assign({}, date);
		},
		bindDelete: function () {
			return "sap-icon://delete";
		},
		bindEdit: function () {
			return "sap-icon://edit";
		},
		userChecker(sString) {
			if (sString == "admin") {
				return true;
			}
			return false;
		},
		checkEditor(sString) {
			if (sString == "admin" || sString == "editor") {
				return true;
			}
			return false;
		},
		calculateDuration(date) {
			if (date) {
				return new Date(date);
			}
			return {};
		},
		calculateExpiry(date) {
			let x = Math.round((new Date(date) - new Date()) / (1000 * 60 * 60 * 24));
			if (x <= 30 && x > -16) {
				return `${x} Day${x > 1 ? "s" : ""}`;
			}

			return;
		},
		calculateExpiryChart(date) {
			let x = Math.round(
				Math.abs((new Date(date) - new Date()) / (1000 * 60 * 60 * 24))
			);

			return x;
		},
		expiryColor(date) {
			let x = Math.round((new Date(date) - new Date()) / (1000 * 60 * 60 * 24));
			if (x > 15 && x < 30) {
				return "Success";
			}
			if (x > 5 && x <= 15) {
				return "Warning";
			}
			if (x <= 5 && x > 0) {
				return "Error";
			} else {
				return "None";
			}
		},
		getShapeColor(doctype) {
			switch (doctype) {
				case "MSA":
					return "sapUiAccent3";
				case "NDA":
					return "sapUiAccent5";
				case "SOW":
					return "sapUiAccent9";
				default:
					return "sapUiAccent10";
			}
		},
	};
});
