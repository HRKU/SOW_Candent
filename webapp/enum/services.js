const hostname = "http://192.168.1.54:8007/sow_candent_api";
// const hostname = "http://192.168.1.56:8008";
// const hostname = "http://localhost:8010/sow_candent_api"
//"localhost" instead of ip address for yash laptop

sap.ui.define(
	{
		testing: hostname + "/app/",
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
