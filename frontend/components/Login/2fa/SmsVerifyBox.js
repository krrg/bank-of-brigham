import React from "react";
import * as F from "react-foundation";
import LoginActions from "../../../actions/LoginActions";
import LoginStore from "../../../stores/LoginStore";

export default class SmsVerifyBox extends React.Component {

    handleVerificationCodeSubmit = (e) => {
        if (e) { e.preventDefault() }
        LoginActions.loginSms(this.refs.code.value);
    }

    render() {
        return (
            <div className="SmsVerifyBox">
                <h2>Enter code</h2>
                <p>We've sent a verification code to (***) ***-**{this.props.digits}</p>
                <form onSubmit={this.handleVerificationCodeSubmit}>
                    <input type="text" placeholder="Code" ref="code"/>
                    <F.Button>Submit</F.Button>
                </form>
            </div>
        )
    }

}
