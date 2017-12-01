import React from "react";
import { Button } from "react-foundation";
import { withRouter } from "react-router-dom";
import LoginActions from "../../../actions/LoginActions";

import "./CodesVerifyBox.scss";

class CodesVerifyBox extends React.Component {

    constructor() {
        super();
    }

    handleSubmitVerificationCode = (e) => {
        if (e) { e.preventDefault(); }

        console.log("Submitting verification code:", this.refs.code.value);
        LoginActions.loginBackupCode(this.refs.code.value.trim());
    }

    render() {
        return (
            <div className="CodesVerifyBox">
                <h2>Enter Verification Code</h2>
                <p>Please enter one of the 8-digit verification codes you received previously.</p>
                <form className="__verificationForm" onSubmit={this.handleSubmitVerificationCode}>
                    <input type="text" placeholder="00009999" ref="code" />
                    <Button type="submit" className="LoginButton">Login</Button>
                </form>
            </div>
        )
    }

}

export default withRouter(CodesVerifyBox);
