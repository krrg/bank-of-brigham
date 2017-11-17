import LoginActions from "../actions/LoginActions";
import axios from "axios";
import { apihost as host } from "../constants";

export const LoginSource = {

    loginPassword: {

        remote(state, username, password) {
            console.log("username: ", username, " password: ", password);
            return axios.post(`${host}/accounts/verify_password`, {
                username: username.trim().toLowerCase(),
                password: password, /* Do not trim or lower case this */
            })
        },

        success: LoginActions.loginPasswordCompleted,
        error: LoginActions.loginPasswordErrored,

    },

    loginSms: {

        remote(state, verificationCode) {
            console.log("Well, we got this far.");

            return axios.post(`${host}/sms/completeverify`, {
                code: verificationCode,
            })
        },

        success: LoginActions.loginSmsCompleted,
        error: LoginActions.loginSmsErrored,

    }

}
