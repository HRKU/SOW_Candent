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
	};
});
