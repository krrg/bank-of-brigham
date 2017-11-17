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

        this.bindAction(LoginActions.loginSms, this.handleLoginSms);
        this.bindAction(LoginActions.loginSmsCompleted, this.handleLoginSmsCompleted);
        this.bindAction(LoginActions.loginSmsErrored, this.handleLoginSmsErrored);
    }

    handleLoginPassword(dispatchedData) {
        const username = dispatchedData[0];
        const password = dispatchedData[1];

        if (! this.getInstance().isLoading()) {
            this.getInstance().loginPassword(username, password)
        }
    }

    handleLoginPasswordCompleted(responseData) {
        console.log("Login is complete.");
    }

    handleLoginPasswordErrored(errorData) {
        this.setState({
            authenticationLevel: null,
            secondFactorType: null,
            errorMessage: "Could not verify username and password",
        })
    }

    handleLoginSms(dispatchedData) {
        const verificationCode = dispatchedData;

        console.log("verification code: ", verificationCode);

        if (! this.getInstance().isLoading()) {
            this.getInstance().loginSms(verificationCode);
        }
    }

    handleLoginSmsCompleted(axiosResponse) {
        console.log("We have completed with ", axiosResponse.data);
        this.setState({
            "authenticationLevel": "full"
        })
    }

    handleLoginSmsErrored(axiosError) {
        this.setState({
            "errorMessage": "Unable to verify code"
        })
    }

}

const AltStore = AltInstance.createStore(LoginStore, 'LoginStore');
export default AltStore;
