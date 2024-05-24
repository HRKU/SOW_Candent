sap.ui.define([
	"sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
    "com/candentech/sowtracker/enum/password",
], function(
	Controller,
    MessageToast,
    JSONModel,
    ePassword,
) {
	"use strict";

	return Controller.extend("com.candentech.sowtracker.controller.ForgotPassword", {
        onInit: function () {
            
        },
        
        // onKeyPress: function (view, event) {
        //     var loginButton = view.byId("idSubmitButton");
        //     if (event.key === "Enter" && loginButton) {
        //         var oUsername = view.byId("username2");
        //         var oPassword = view.byId("OTP");
        
        //         if (!oUsername.getValue()) {
        //             oUsername.focus();
        //             return;
        //         }
        //         if (!oPassword.getValue()) {
        //             oPassword.focus();
        //             return;
        //         }
        //         loginButton.firePress();
        //     }
        // },
        
        onShowPasswordSelect: function (oEvent) {
            var oPasswordInput = oEvent.getSource();
            var temp = oPasswordInput.getValueHelpIconSrc().split("://");
            var state = temp.pop();
            temp.push(ePassword.opposite_state[state]);
            oPasswordInput.setType(ePassword.input_type[state]);
            oPasswordInput.setValueHelpIconSrc(temp.join("://"));
        },
        onSendOTPPress: function () {
            var oView = this.getView();
            var oEmail = oView.byId("username2");
            var usernameValue = oEmail.getValue().trim(); // Trim whitespace
        
            // Check if username input is empty
            if (!usernameValue) {
                MessageToast.show("Please enter a username.");
                return; // Stop execution if input is empty
            }
        
            var oModel = new sap.ui.model.json.JSONModel();
            oModel.setProperty("/username", usernameValue);
        
            fetch("http://192.168.1.36:8000/users/otp/", {
                method: "POST",
                body: JSON.stringify(oModel.getData()),
                credentials: "include",
            }) 
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    MessageToast.show(data.success);
                    oView.byId("idSubmitButton").setVisible(true);
                    oView.byId("OTP").setVisible(true);
                    oView.byId("username2").setVisible(false);
                    oView.byId("idSendOTP").setVisible(false);
                } else {
                    MessageToast.show("Invalid Login Credentials");
                    throw new Error("LOGIN ERROR");
                }
            })
        },
        
        validatePress: function () {
            var oView = this.getView();
            var oPassword = oView.byId("idVBox1");
            var oOTP = oView.byId("OTP");
            var oEmail = oView.byId("username2");
            var oButton = oView.byId("idSubmitButton");
            var oSubmit = oView.byId("idSubmitButton1");
            var oModel = new sap.ui.model.json.JSONModel();
            oModel.setProperty("/otp", parseInt(oOTP.getValue()));
            oModel.setProperty("/username", oEmail.getValue());

            fetch("http://192.168.1.36:8000/users/list/", {
                method: "POST",
                body: JSON.stringify(oModel.getData()),
                credentials: "include",
            }) 
            .then((res) => res.json())
            .then((data) => {
                if (!data.res) {
                    // debugger;
                    MessageToast.show(data.success);
                    oPassword.setVisible(!oPassword.getVisible());
                    oSubmit.setVisible(!oSubmit.getVisible());
                    oView.byId("OTP").setVisible(false);
                    oView.byId("username2").setVisible(false)
                    oView.byId("OTP").setVisible(false);
                    oButton.setVisible(false);
                } else {
                    MessageToast.show("Invalid OTP");
                    this.byId("OTP").setValueState("Error");

                }
            })
        },
        oSubmitPress: function () {
            var oView = this.getView();
            var oEmail = oView.byId("username2");
            var oModel = new sap.ui.model.json.JSONModel();
            var oPassword1 = oView.byId("confirmPassword");
            var oPassword2 = oView.byId("newPassword");
            if (
                oPassword1.getValue() || oPassword2.getValue() 
            ) {
                if (
                    oPassword1.getValue() !== oPassword2.getValue() 
                ) {
                    this.byId("confirmPassword").setValueState("Error");
                    this.byId("confirmPassword").setValueStateText("Passwords do not match");
                    return;
                }
            }
            oModel.setProperty("/username", oEmail.getValue());
            oModel.setProperty("/password", oPassword1.getValue());

            fetch("http://192.168.1.36:8000/users/list/", {
                method: "PUT",
                body: JSON.stringify(oModel.getData()),
                credentials: "include",
            })
            .then((res) => res.json())
            .then((data) => {
                if (!data.res) {
                        MessageToast.show(data.success);
                        this.getOwnerComponent().getRouter().navTo("RouteLogin");
                        location.reload();
                    }
                    else {
                        MessageToast.show(data.error);
                    }
                })
        },
        onBackPress: function () {
            this.getOwnerComponent().getRouter().navTo("RouteLogin");
            location.reload();
        }
	});
});