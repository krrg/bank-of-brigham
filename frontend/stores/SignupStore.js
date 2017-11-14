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
        this.bindAction(SignupActions.postSignup, this.handlePostSignup);
        this.bindAction(SignupActions.postSignupCompleted, this.handlePostSignupCompleted);
        this.bindAction(SignupActions.postSignupErrored, this.handlePostSignupErrored);

        this.bindAction(SignupActions.postSignupSms, this.handlePostSignupSms);
        this.bindAction(SignupActions.postSignupSmsCompleted, this.handlePostSignupSmsCompleted);
        this.bindAction(SignupActions.postSignupSmsErrored, this.handlePostSignupSmsErrored);
    }

    handlePostSignup(data) {
        const username = data[0];
        const password = data[1];

        console.log("Signing up user with username and password", username, password);

        if (! this.getInstance().isLoading()) {
            this.getInstance().signup(username, password);
        }
    }

    handlePostSignupCompleted(axiosResult) {
        this.resetErrors();

        this.setState({
            readyFor2faSelection: true,
        })

    }

    handlePostSignupErrored(axiosResult) {
        this.resetErrors();
        if (axiosResult.response.status === 409 /* Conflict */) {
            this.addError("usernameAlreadyTaken");
            return;
        }
    }

    handlePostSignupSms(phoneNumber) {
        console.log(`Trying to post signup SMS with ${phoneNumber}`);
        if (! this.getInstance().isLoading()) {
            this.getInstance().registerSms(phoneNumber);
        }
    }

    handlePostSignupSmsCompleted(axiosResult) {

    }

    handlePostSignupSmsErrored(axiosError) {

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
