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
        },

        success: AdminActions.get2faLoginEventsCompleted,
        error: AdminActions.get2faLoginEventsErrored,
    },


    getUsersList: {
        remote(state) {
            return axios.get(`${host}/admin/accounts`);
        },

        local(state) {
            return state["usersList"];
        },

        success: AdminActions.getUsersListCompleted,
        error: AdminActions.getUsersListErrored,
    }



}

export default AdminSource;
