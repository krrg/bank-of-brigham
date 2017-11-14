import React from "react";
import * as F from "react-foundation";

import SignupActions from "../../../actions/SignupActions";

import "./SmsSignup.scss";

export default class SmsSignup extends React.Component {

    handlePhoneNumberRegister = (e) => {
        if (e) { e.preventDefault() }

        SignupActions.postSignupSms(this.refs.phoneNumber.value);
    }

    render() {
        return (
            <div className="SmsSignup">
                <div className="__content">
                    <h2>Phone Verification</h2>

                    <form onSubmit={this.handlePhoneNumberRegister}>
                        <label>Enter phone number:</label>
                        <input type="text" placeholder="555-555-5555" ref="phoneNumber" />
                        <F.Button type="submit">Verify with SMS</F.Button>
                    </form>
                </div>
            </div>
        )
    }

}
