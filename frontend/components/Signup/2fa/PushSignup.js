import React from "react";
import { withRouter } from "react-router-dom";
import { Button } from "react-foundation";

import SignupStore from "../../../stores/SignupStore";
import SignupActions from "../../../actions/SignupActions";
import ErrorWrapper from "../../ErrorWrapper";
import LoadingSpinner from "../../LoadingSpinner";


import "./PushSignup.scss";

class PushSignup extends React.Component {

    constructor() {
        super();

        this.state = {
            confirmationPushed: false,
            authySuccess: false,
        }
    }

    handleRegisterForPush = (e) => {
        if (e) { e.preventDefault(); }
        const phoneNumber = this.refs.phoneNumber.value;
        this.setState({
            confirmationPushed: true,
        })
        SignupActions.signupPush(phoneNumber);
    }

    handleSignupStoreUpdated = (storeState) => {
        this.setState({
            authySuccess: storeState["authySuccess"]
        })

        if (this.state.authySuccess) {
            console.log("Successful")
            setTimeout(() => {
                this.props.history.push("/bank");
            }, 0);
        }
    }

    componentDidMount() {
        SignupStore.listen(this.handleSignupStoreUpdated);
    }

    componentWillUnmount() {
        SignupStore.unlisten(this.handleSignupStoreUpdated);
    }

    renderContent = () => {
        if (this.state.confirmationPushed) {
            return (
                <div>
                    <LoadingSpinner />
                    <p style={{textAlign: "center"}}>Use the Authy app on your phone to approve this login request.</p>
                </div>
            )
        } else {
            return (
                <form onSubmit={this.handleRegisterForPush}>
                    <label>Enter phone number:</label>
                    <input type="text" placeholder="555-555-5555" ref="phoneNumber" />
                    <Button type="submit">Continue</Button>
                </form>
            )
        }
    }

    render() {
        return (
            <div className="PushSignup">
                <div className="__content">
                    <h2>Verification Signup</h2>

                    <ErrorWrapper
                        isErrored={this.state.onetouchErrored}
                        message={"There was some sort of problem on our end..."}
                    >
                        { this.renderContent() }
                    </ErrorWrapper>
                </div>
            </div>
        )
    }
}

export default withRouter(PushSignup);
