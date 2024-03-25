const hostname = "http://yw:8000/sow_candent_api"

sap.ui.define({
		// Login Api
		login: hostname + "/login/",
		// delete api
		delete: hostname + "/agreements/delete/",
		//uploadExcel api
		uploadexcel: hostname + "/upload_excel/",
		//createuser api
		creatUser: hostname + "/userapi/",
		//agreementList api
		agreementList: hostname + "/agreements/list",
		//agreementCreate api
		agreementCreate: hostname + "/agreements/create/",
		// update
		update: hostname + "/agreements/update/",
	},
	true
);