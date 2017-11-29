import SignupActions from "../actions/SignupActions";
import axios from "axios";
import { apihost as host } from "../constants";

export const SignupSource = {

    signup: {

        remote(state, username, password) {
            return axios.post(`${host}/accounts`, {
                username: username.trim().toLowerCase(),
                password: password
            })
        },

        success: SignupActions.signupCompleted,
        error: SignupActions.signupErrored,

    },

    registerSms: {
        remote(state, phoneNumber) {
            return axios.post(`${host}/sms/enable`, {
                phone_number: phoneNumber
            })
        },

        success: SignupActions.signupSmsCompleted,
        error: SignupActions.signupSmsErrored,
    },

    enableBackupCodes: {
        remote(state) {
            return axios.post(`${host}/codes/enable`)
        },

        success: SignupActions.signupBackupCodesCompleted,
        error: SignupActions.signupBackupCodesErrored,
    },

    enableTotp: {
        remote(state) {
            return axios.post(`${host}/totp/enable`);
        },

        success: SignupActions.signupTotpCompleted,
        error: SignupActions.signupTotpErrored,
    }

}
