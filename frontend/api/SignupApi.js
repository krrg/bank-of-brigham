import SignupActions from "../actions/SignupActions";
import axios from "axios";
import bluebird from "bluebird";
import { apihost as host } from "../constants";
import u2f from "../lib/u2f";
import { AuthyHelper } from "./AuthyHelper";

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
            // console.log("U2F:  Yes it is supported");

            const response = await axios.post(`${host}/u2f/beginenable`)
            const registrationRequest = response.data;
            console.log("here is the registration request", registrationRequest);

            const appId = response.data["appId"];
            const registerRequests = response.data["registerRequests"];

            const regResponse = await new Promise((resolve, reject) => {
                const waitForYubiKey = () => {
                    u2f.register(appId, registerRequests, [], (chromeResponse) => {
                        if (chromeResponse["errorCode"]) {
                            console.error("We had a U2F error, but ignoring it...", chromeResponse);
                            setTimeout(waitForYubiKey, 0);
                        } else {
                            resolve(chromeResponse);
                        }
                    });
                }
                setTimeout(waitForYubiKey, 0);
            });

            return await axios.post(`${host}/u2f/completeenable`, regResponse);
        },

        success: SignupActions.signupU2FCompleted,
        error: SignupActions.signupU2FErrored,
    },

    registerPush: {
        async remote(state, phoneNumber) {
            await axios.post(`${host}/push/beginenable`, {
                "phone_number": phoneNumber,
            });

            return await AuthyHelper.check_authy_status();
        },

        success: SignupActions.signupPushCompleted,
        error: SignupActions.signupPushErrored,
    }

}




