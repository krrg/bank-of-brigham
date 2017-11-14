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

        success: SignupActions.postSignupCompleted,
        error: SignupActions.postSignupErrored,

    },

    registerSms: {
        remote(state, phoneNumber) {
            return axios.post(`${host}/sms/enable`, {
                phone_number: phoneNumber
            })
        },

        success: SignupActions.postSignupSmsCompleted,
        error: SignupActions.postSignupSmsErrored,
    }

}
