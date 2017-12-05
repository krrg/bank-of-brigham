import React from "react";
import { Button } from "react-foundation";
import { withRouter } from "react-router-dom";
import ErrorWrapper from "../../ErrorWrapper";
import SignupActions from "../../../actions/SignupActions";
import SignupStore from "../../../stores/SignupStore";
import "./SmsSignup.scss";
import LoadingSpinner from "../../LoadingSpinner";


class SmsSignup extends React.Component {

    constructor() {
        super();

        this.state = {
            invalidPhoneNumber: false,
        }
    }

    handlePhoneNumberRegister = (e) => {
        if (e) { e.preventDefault() }
        SignupActions.signupSms(this.refs.phoneNumber.value);
        this.setState({
            waiting: true,
        })
    }

    handleSignupStoreUpdated = (storeState) => {
        /* Check if there was an error or not */
        this.setState({
            waiting: false,
            invalidPhoneNumber: SignupStore.getErrorStatus("invalidPhoneNumber"),
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

                    { this.state.waiting ? <LoadingSpinner /> :
                    <ErrorWrapper
                        isErrored={this.state.invalidPhoneNumber}
                        message="This is awkward, but your phone number doesn't seem to check out..."
                    >
                        <form onSubmit={this.handlePhoneNumberRegister}>
                            <label>Enter phone number:</label>
                            <input type="text" placeholder="555-555-5555" ref="phoneNumber" />
                            <Button type="submit">Verify with SMS</Button>
                        </form>
                    </ErrorWrapper>
                    }


                </div>
            </div>
        )
    }

}

export default withRouter(SmsSignup);
