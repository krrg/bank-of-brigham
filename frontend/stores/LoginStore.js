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

        this.bindAction(LoginActions.loginBackupCode, this.handleLoginBackupCode);
        this.bindAction(LoginActions.loginBackupCodeCompleted, this.handleLoginBackupCodeCompleted);
        this.bindAction(LoginActions.loginBackupCodeErrored, this.handleLoginBackupCodeErrored);

        this.bindAction(LoginActions.loginTotp, this.handleLoginTotp);
        this.bindAction(LoginActions.loginTotpCompleted, this.handleLoginTotpCompleted);
        this.bindAction(LoginActions.loginTotpErrored, this.handleLoginTotpErrored);

        this.bindAction(LoginActions.loginU2F, this.handleLoginU2F);
        this.bindAction(LoginActions.loginU2FCompleted, this.handleLoginU2FCompleted);
        this.bindAction(LoginActions.loginU2FErrored, this.handleLoginU2FErrored);

        this.bindAction(LoginActions.loginPush, this.handleLoginPush);
        this.bindAction(LoginActions.loginPushCompleted, this.handleLoginPushCompleted);
        this.bindAction(LoginActions.loginPushErrored, this.handleLoginPushErrored);

    }

    setFullAuthenticationState() {
        this.setState({
            "authenticationLevel": "full",
            "errorMessage": null
        })
    }

    setErrorMessageState(errorMessage) {
        this.setState({
            "errorMessage": errorMessage,
        })
    }

    clearErrorMessageState() {
        this.setErrorMessageState(null);
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
        this.clearErrorMessageState();

        const username = dispatchedData[0];
        const password = dispatchedData[1];

        if (! this.getInstance().isLoading()) {
            this.getInstance().loginPassword(username, password)
        }
    }

    handleLoginPasswordCompleted(axiosResponse) {
        this.clearErrorMessageState();
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
        this.clearErrorMessageState();
        if (! this.getInstance().isLoading()) {
            this.getInstance().beginSmsVerification();
        }
    }

    handleBeginSmsCompleted(axiosResponse) {
        this.clearErrorMessageState();
        this.setState({
            phoneNumber: axiosResponse.data["last_phone_number_digits"]
        })
    }

    handleLoginSms(dispatchedData) {
        const verificationCode = dispatchedData;
        if (! this.getInstance().isLoading()) {
            this.getInstance().loginSms(verificationCode);
        }
    }

    handleLoginSmsCompleted(axiosResponse) {
        this.setFullAuthenticationState();
    }

    handleLoginSmsErrored(axiosError) {
        this.setErrorMessageState("Unable to verify code");
    }

    handleLoginBackupCode(dispatchedData) {
        const verificationCode = dispatchedData;
        if (! this.getInstance().isLoading()) {
            this.getInstance().loginBackupCode(verificationCode);
        }
    }

    handleLoginBackupCodeCompleted(axiosResult) {
        this.setFullAuthenticationState();
    }

    handleLoginBackupCodeErrored(axiosError) {
        this.setErrorMessageState("Unable to verify code");
    }

    handleLoginTotp(code) {
        if (! this.getInstance().isLoading()) {
            this.getInstance().verifyTotp(code);
        }
    }

    handleLoginTotpCompleted(axiosResult) {
        this.setFullAuthenticationState();
    }

    handleLoginTotpErrored(axiosError) {
        this.setErrorMessageState("Unable to verify OTP");
    }

    handleLoginU2F() {
        if (! this.getInstance().isLoading()) {
            this.getInstance().loginU2F();
        }
    }

    handleLoginU2FCompleted(axiosResponse) {
        this.setFullAuthenticationState();
        // console.log("We've got a U2F verification: ", axiosResponse.data);
    }

    handleLoginU2FErrored(u2fError) {
        this.setState({
            "u2fErrorCode": u2fError["errorCode"]
        })
    }

    handleLoginPush() {
        if (! this.getInstance().isLoading()) {
            this.getInstance().loginAuthyPush();
        }
    }

    handleLoginPushCompleted() {
        this.setFullAuthenticationState();
    }

    handleLoginPushErrored() {
        this.setErrorMessageState("Unable to verify authy push");
    }

}

const AltStore = AltInstance.createStore(LoginStore, 'LoginStore');
export default AltStore;
