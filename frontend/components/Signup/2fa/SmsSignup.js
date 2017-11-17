import React from "react";
import * as F from "react-foundation";
import { withRouter } from "react-router-dom";
import ErrorWrapper from "../../ErrorWrapper";
import SignupActions from "../../../actions/SignupActions";
import SignupStore from "../../../stores/SignupStore";
import "./SmsSignup.scss";


class SmsSignup extends React.Component {

    constructor() {
        super();

        this.state = {
            invalidPhoneNumber: false,
        }
    }

    handlePhoneNumberRegister = (e) => {
        if (e) { e.preventDefault() }
        SignupActions.postSignupSms(this.refs.phoneNumber.value);
    }

    handleSignupStoreUpdated = (storeState) => {
        /* Check if there was an error or not */
        this.setState({
            invalidPhoneNumber: SignupStore.getErrorStatus("invalidPhoneNumber")
        });

        if (storeState["readyForSmsVerificationCode"]) {
            this.props.history.push("/create/4/sms")
        }
    }

    componentDidMount() {
        SignupStore.listen(this.handleSignupStoreUpdated);
    }

    componentWillUnmount() {
        SignupStore.unlisten(this.handleSignupStoreUpdated);
    }

    render() {
        return (
            <div className="SmsSignup">
                <div className="__content">
                    <h2>Phone Verification</h2>

                    <ErrorWrapper
                        isErrored={this.state.invalidPhoneNumber}
                        message="This is awkward, but your phone number doesn't seem to check out..."
                    >
                        <form onSubmit={this.handlePhoneNumberRegister}>
                            <label>Enter phone number:</label>
                            <input type="text" placeholder="555-555-5555" ref="phoneNumber" />
                            <F.Button type="submit">Verify with SMS</F.Button>
                        </form>
                    </ErrorWrapper>
                </div>
            </div>
        )
    }

}

export default withRouter(SmsSignup);
