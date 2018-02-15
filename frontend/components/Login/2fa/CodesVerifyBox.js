import React from "react";
import { Button } from "react-foundation";
import { withRouter } from "react-router-dom";
import LoginActions from "../../../actions/LoginActions";
import LoginStore from "../../../stores/LoginStore";
import ErrorWrapper from "../../ErrorWrapper";

import "./CodesVerifyBox.scss";
import { LoginApiHelpers } from "../../../api/LoginApi";

class CodesVerifyBox extends React.Component {

    constructor() {
        super();

        this.state = {
            isErrored: false,
            message: ""
        }
    }

    handleSubmitVerificationCode = (e) => {
        if (e) { e.preventDefault(); }

        console.log("Submitting verification code:", this.refs.code.value);
        console.log("Just got back verification", LoginActions.loginBackupCode(this.refs.code.value.trim()));
    }

    handleLoginStoreUpdated = (storeState) => {
        this.setState({
            isErrored: !! storeState["errorMessage"],
            message: storeState["errorMessage"],
        })
    }

    componentDidMount() {
        LoginApiHelpers.beginLoginCodes();
        LoginStore.listen(this.handleLoginStoreUpdated);
    }

    componentWillUnmount() {
        LoginStore.unlisten(this.handleLoginStoreUpdated);
    }

    render() {
        return (
            <div className="CodesVerifyBox">
                <h2>Enter Verification Code</h2>
                <p>Please enter one of the 8-digit verification codes you received previously.</p>
                <form className="__verificationForm" onSubmit={this.handleSubmitVerificationCode}>
                    <ErrorWrapper isErrored={this.state.isErrored} message={this.state.message}>
                        <input type="text" placeholder="00009999" ref="code" />
                    </ErrorWrapper>
                    <Button type="submit" className="LoginButton">Login</Button>
                </form>
            </div>
        )
    }

}

export default withRouter(CodesVerifyBox);
