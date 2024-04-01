<<<<<<< HEAD
const hostname = "http://192.168.1.53:8001/sow_candent_api";
//"localhost" instead of ip address for yash laptop

sap.ui.define(
	{
=======
const hostname = "http://yw:8000/sow_candent_api"

sap.ui.define({
>>>>>>> 02b216d23328db5355b11dca6816bc351d3cc976
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