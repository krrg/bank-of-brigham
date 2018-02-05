import AltInstance from "../alt";
import SignupActions from "../actions/SignupActions";
import { SignupSource } from "../api/SignupApi";
import _ from "lodash";


class SignupStore {
    constructor() {
        this.state = {
            errors: {},
            readyFor2faSelection: false,
        }

        this.registerAsync(SignupSource);
        this.bindAction(SignupActions.signup, this.handleSignup);
        this.bindAction(SignupActions.signupCompleted, this.handleSignupCompleted);
        this.bindAction(SignupActions.signupErrored, this.handleSignupErrored);

        this.bindAction(SignupActions.signupSms, this.handleSignupSms);
        this.bindAction(SignupActions.signupSmsCompleted, this.handleSignupSmsCompleted);
        this.bindAction(SignupActions.signupSmsErrored, this.handleSignupSmsErrored);

        this.bindAction(SignupActions.signupBackupCodes, this.handleSignupBackupCodes);
        this.bindAction(SignupActions.signupBackupCodesCompleted, this.handleSignupBackupCodesCompleted);
        this.bindAction(SignupActions.signupBackupCodesErrored, this.handleSignupBackupCodesErrored);

        this.bindAction(SignupActions.signupTotp, this.handleSignupTotp);
        this.bindAction(SignupActions.signupTotpCompleted, this.handleSignupTotpCompleted);
        this.bindAction(SignupActions.signupTotpErrored, this.handleSignupTotpErrored);

        this.bindAction(SignupActions.signupU2F, this.handleSignupU2F);
        this.bindAction(SignupActions.signupU2FCompleted, this.handleSignupU2FCompleted);
        this.bindAction(SignupActions.signupU2FErrored, this.handleSignupU2FErrored);

        this.bindAction(SignupActions.signupPush, this.handleSignupPush);
        this.bindAction(SignupActions.signupPushCompleted, this.handleSignupPushCompleted);
        this.bindAction(SignupActions.signupPushErrored, this.handleSignupPushErrored);

    }

    handleSignup(data) {
        const username = data[0];
        const password = data[1];

        console.log("Signing up user with username and password", username, password);

        if (! this.getInstance().isLoading()) {
            this.getInstance().signup(username, password);
        }
    }

    handleSignupCompleted(axiosResult) {
        this.resetErrors();

        this.setState({
            readyFor2faSelection: true,
        })

    }

    handleSignupErrored(axiosResult) {
        this.resetErrors();
        if (axiosResult.response.status === 409 /* Conflict */) {
            this.addError("usernameAlreadyTaken");
            return;
        } else if (axiosResult.response.status === 400) {
            const error = axiosResult.response.data["error"];
            console.log("Adding generically bad error", error)
            this.addError(error);
            return;
        }
    }

    handleSignupSms(phoneNumber) {
        this.resetErrors();
        this.setState({
            readyForSmsVerificationCode: false,
        })
        if (! this.getInstance().isLoading()) {
            this.getInstance().registerSms(phoneNumber);
        }
    }

    handleSignupSmsCompleted(axiosResult) {
        this.resetErrors();
        this.setState({
            readyForSmsVerificationCode: true,
            lastPhoneDigits: axiosResult.data["last_phone_number_digits"],
        })
    }

    handleSignupSmsErrored(axiosError) {
        this.resetErrors();
        this.addError("invalidPhoneNumber");
    }

    handleSignupBackupCodes() {
        if (! this.getInstance().isLoading()) {
            this.getInstance().enableBackupCodes();
        }
    }

    handleSignupBackupCodesCompleted(axiosResult) {
        const backupCodes = axiosResult.data["codes"];
        this.setState({
            backupCodes: backupCodes,
        })
    }

    handleSignupBackupCodesErrored(axiosResult) {
        console.error("Could not sign up for backup codes...");
    }

    handleSignupTotp() {
        if (! this.getInstance().isLoading()) {
            this.getInstance().enableTotp();
        }
    }

    handleSignupTotpCompleted(axiosResult) {
        const totpProvisioningUri = axiosResult.data["totp_uri"];
        const totpSecret = axiosResult.data["totp_secret"];
        this.setState({
            totpProvisioningUri: totpProvisioningUri,
            totpSecret: totpSecret,
        })
    }

    handleSignupTotpErrored() {
        console.error("Unable to signup for TOTP");
    }

    handleSignupU2F() {
        if (! this.getInstance().isLoading()) {
            this.getInstance().registerU2F();
        }
    }

    handleSignupU2FCompleted(axiosResult) {
        this.setState({
            u2fCompleted: true,
        })
    }

    handleSignupU2FErrored(error) {
        this.addError("u2f");
    }

    handleSignupPush(phoneNumber) {
        if (! this.getInstance().isLoading()) {
            this.getInstance().registerPush(phoneNumber);
        }
    }

    handleSignupPushCompleted(axiosResult) {
        this.setState({
            authySuccess: true
        })
    }

    handleSignupPushErrored(axiosError) {
        this.addError("push");
    }

    resetErrors() {
        this.setState({
            errors: {},
        });
    }

    addError(key) {
        const currentErrors = this.state.errors;
        currentErrors[key] = true;
        this.setState({
            errors: currentErrors
        });
    }

    static getErrorStatus(key) {
        const status = this.state.errors[key];

        if (status === undefined || status === null) {
            return false;
        }
        return status;
    }

}

const AltStore = AltInstance.createStore(SignupStore, 'SignupStore');
export default AltStore;
