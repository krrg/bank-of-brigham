import AdminActions from "../actions/AdminActions";
import axios from "axios";
import babelPolyfill from "babel-polyfill";
import { apihost as host } from "../constants";

const AdminSource = {

    getPasswordLoginEvents: {
        remote(state) {
            console.log("Here");
            return axios.get(`${host}/events/logins/password`);
        },

        success: AdminActions.getPasswordLoginEventsCompleted,
        error: AdminActions.getPasswordLoginEventsErrored,
    },

    get2FALoginEvents: {
        remote(state) {
            return axios.get(`${host}/events/logins/2fa`);
        }
    },


    getUsers: {
        remote(state) {
            return axios.get(`${host}/admin/accounts`);
        }
    }



}

export default AdminSource;
