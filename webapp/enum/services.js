const hostname = "http://192.168.1.53:8001/sow_candent_api";
//"localhost" instead of ip address for yash laptop

sap.ui.define(
	{
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
