import SignupActions from "../actions/SignupActions";
import axios from "axios";
import u2f from "u2f-api";
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
    },

    registerU2F: {
        async remote(state)  {
            // await u2f.ensureSupport();
            console.log("U2F:  Yes it is supported");

            const registrationRequest = await axios.post(`${host}/u2f/beginenable`)
            console.log("Just got back result from u2f axios: ", registrationRequest);

            const registrationResponse = await u2f.register(registrationRequest);
            console.log("just got a registration response from the YubiKey", registrationResponse)

            const completion = await axios.post(`${host}/u2f/completeenable`, registrationResponse);
            console.log("Completed!");
        },

        success: SignupActions.signupU2FCompleted,
        error: SignupActions.signupU2FErrored,
    }

}
