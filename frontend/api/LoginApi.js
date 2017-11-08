import LoginActions from "../actions/LoginActions";
import axios from "axios";
import { apihost as host } from "../constants";

export const LoginSource = {

    loginPassword: {

        remote(state, username, password) {
            axios.post(`${host}/accounts/verify_password`, {
                username: username.trim().toLowerCase(),
                password: password, /* Do not trim or lower case this */
            })
        },

        success: LoginActions.loginPasswordCompleted,
        error: LoginActions.loginPasswordErrored,

    }

}
