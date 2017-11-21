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

        this.bindAction(LoginActions.logout, this.handleLogout);

        this.bindAction(LoginActions.loginPassword, this.handleLoginPassword);
        this.bindAction(LoginActions.loginPasswordCompleted, this.handleLoginPasswordCompleted);
        this.bindAction(LoginActions.loginPasswordErrored, this.handleLoginPasswordErrored);

        this.bindAction(LoginActions.loginSms, this.handleLoginSms);
        this.bindAction(LoginActions.loginSmsCompleted, this.handleLoginSmsCompleted);
        this.bindAction(LoginActions.loginSmsErrored, this.handleLoginSmsErrored);

        this.bindAction(LoginActions.beginSms, this.handleBeginSms);
        this.bindAction(LoginActions.beginSmsCompleted, this.handleBeginSmsCompleted);
    }

    handleLogout = () => {
        this.setState({
            authenticationLevel: null,
            secondFactor: null,
            errorMessage: null,
        })

        if (! this.getInstance().isLoading()) {
            this.getInstance().logout();
        }
    }

    handleLoginPassword(dispatchedData) {
        const username = dispatchedData[0];
        const password = dispatchedData[1];

        if (! this.getInstance().isLoading()) {
            this.getInstance().loginPassword(username, password)
        }
    }

    handleLoginPasswordCompleted(axiosResponse) {
        this.setState({
            "authenticationLevel": "password",
            "secondFactor": axiosResponse.data["secondFactor"],
        })
    }

    handleLoginPasswordErrored(errorData) {
        this.setState({
            authenticationLevel: null,
            secondFactorType: null,
            errorMessage: "Could not verify username and password",
        })
    }

    handleBeginSms() {
        console.log("We are about to send the text message");
        if (! this.getInstance().isLoading()) {
            this.getInstance().beginSmsVerification();
        }
    }

    handleBeginSmsCompleted(axiosResponse) {
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
        this.setState({
            phoneNumber: axiosResponse.data["last_phone_number_digits"]
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
