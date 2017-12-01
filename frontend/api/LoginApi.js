import LoginActions from "../actions/LoginActions";
import axios from "axios";
import { apihost as host } from "../constants";
import u2f from "../lib/u2f";

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
    },

    loginU2F: {
        async remote(state) {
            const response = await axios.post(`${host}/u2f/beginverify`)
            const appId = response.data["appId"];
            const challenge = response.data["challenge"];
            const keys = response.data["registeredKeys"];

            const responseToChallenge = await new Promise((resolve, reject) => {
                u2f.sign(appId, challenge, keys, (chromeResponse) => {
                    // console.log("We got a signature people!", result);
                    if (chromeResponse["errorCode"]) {
                        reject(chromeResponse);
                    } else {
                        resolve(chromeResponse);
                    }
                })
            });

            return await axios.post(`${host}/u2f/completeverify`, responseToChallenge);
        },

        success: LoginActions.loginU2FCompleted,
        error: LoginActions.loginU2FErrored,
    }

}
