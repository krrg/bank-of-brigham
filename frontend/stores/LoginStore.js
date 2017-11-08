import AltInstance from "../alt";
import LoginActions from "../actions/LoginActions";

import _ from "lodash";


class LoginStore {
    constructor() {
        this.state = {
            authenticationLevel: null,
            secondFactorType: null,
        }

        this.bindAction(LoginActions.loginPassword, this.handleLoginPassword);
        this.bindAction(LoginActions.loginPasswordCompleted, this.handleLoginPasswordCompleted);
    }

    /*     'loginPassword',
    'loginPasswordCompleted'
    */

    handleLoginPassword(username, password) {

    }

    handleLoginPasswordCompleted(responseData) {

    }

}

const AltAccountsStore = AltInstance.createStore(AccountsStore, 'AccountsStore');
export default AltAccountsStore;
