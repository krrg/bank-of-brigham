import AltInstance from "../alt";
import LoginActions from "../actions/LoginActions";
import { LoginSource } from "../api/LoginApi";
import _ from "lodash";
import { SignupSource } from "../api/SignupApi";


class LoginStore {
    constructor() {
        this.state = {
            authenticationLevel: null,
            secondFactorType: null,
            errorMessage: null,
        }

        this.registerAsync(LoginSource);
        this.bindAction(LoginActions.loginPassword, this.handleLoginPassword);
        this.bindAction(LoginActions.loginPasswordCompleted, this.handleLoginPasswordCompleted);
        this.bindAction(LoginActions.loginPasswordErrored, this.handleLoginPasswordErrored);
    }

    handleLoginPassword(dispatchedData) {
        const username = dispatchedData[0];
        const password = dispatchedData[1];

        if (! this.getInstance().isLoading()) {
            this.getInstance().loginPassword(username, password)
        }
    }

    handleLoginPasswordCompleted(responseData) {

        console.log("The login was a success");
        console.log(responseData);

    }

    handleLoginPasswordErrored(errorData) {
        this.setState({
            authenticationLevel: null,
            secondFactorType: null,
            errorMessage: "Could not verify username and password",
        })
    }

}

const AltStore = AltInstance.createStore(LoginStore, 'LoginStore');
export default AltStore;
