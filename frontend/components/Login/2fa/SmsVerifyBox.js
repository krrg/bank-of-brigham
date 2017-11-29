import React from "react";
import PropTypes from "prop-types";
import { Button } from "react-foundation";
import LoginActions from "../../../actions/LoginActions";
import LoginStore from "../../../stores/LoginStore";
import LoadingSpinner from "../../LoadingSpinner";


export default class SmsVerifyBox extends React.Component {

    static propTypes = {
        digits: PropTypes.string,
    }

    handleVerificationCodeSubmit = (e) => {
        if (e) { e.preventDefault() }
        LoginActions.loginSms(this.refs.code.value);
    }

    render() {
        if (! this.props.digits) {
            return (
                <span>
                    Sending verification text message...
                    <LoadingSpinner />
                </span>
            )
        }

        return (
            <div className="SmsVerifyBox">
                <h2>Enter code</h2>
                <p>We've sent a verification code to (***) ***-**{this.props.digits}</p>
                <form onSubmit={this.handleVerificationCodeSubmit}>
                    <input type="text" placeholder="Code" ref="code"/>
                    <Button>Submit</Button>
                </form>
            </div>
        )
    }

}
