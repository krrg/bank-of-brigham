import LoginActions from "../actions/LoginActions";
import axios from "axios";
import { apihost as host } from "../constants";

export const LoginSource = {

    logout:  {
        remote(state) {
            return axios.delete(`${host}/accounts/session`);
        },

        success: LoginActions.logoutCompleted,
        error: LoginActions.logoutCompleted /* There isn't much we can do about an error */
    },

    loginPassword: {

        remote(state, username, password) {
            return axios.post(`${host}/accounts/verify_password`, {
                username: username.trim().toLowerCase(),
                password: password, /* Do not trim or lower case this */
            });
        },

        success: LoginActions.loginPasswordCompleted,
        error: LoginActions.loginPasswordErrored,

    },

    loginSms: {

        remote(state, verificationCode) {
            return axios.post(`${host}/sms/completeverify`, {
                code: verificationCode,
            });
        },

        success: LoginActions.loginSmsCompleted,
        error: LoginActions.loginSmsErrored,

    },

    beginSmsVerification: {
        remote(state) {
            return axios.post(`${host}/sms/beginverify`);
        },

        success: LoginActions.beginSmsCompleted,
        error: LoginActions.beginSmsErrored,
    },

    loginBackupCode: {
        remote(state, verificationCode) {
            return axios.post(`${host}/codes/verify`, {
                code: verificationCode
            });
        },

        success: LoginActions.loginBackupCodeCompleted,
        error: LoginActions.loginBackupCodeErrored,
    },

    verifyTotp: {
        remote(state, verificationCode) {
            return axios.post(`${host}/totp/verify`, {
                code: verificationCode
            });
        },

        success: LoginActions.loginTotpCompleted,
        error: LoginActions.loginTotpErrored,
    }

}
