import React from "react";
import { withRouter } from "react-router-dom";
import SignupStore from "../../../stores/SignupStore";
import SignupActions from "../../../actions/SignupActions";
import LoadingSpinner from "../../LoadingSpinner";
import { Button } from "react-foundation";

import "./U2FSignup.scss";

class U2FSignup extends React.Component {

    constructor() {
        super();

        this.state = {
            u2fCompleted: false,
        }
    }

    handleSignupStoreUpdated = (storeState) => {
        this.setState({
            u2fCompleted: storeState["u2fCompleted"],
        });
    }

    componentDidMount() {
        SignupStore.listen(this.handleSignupStoreUpdated);
        SignupActions.signupU2F();
    }

    componentWillUnmount() {
        SignupStore.unlisten(this.handleSignupStoreUpdated);
    }

    advanceToBankingInterface = (e) => {
        if (e) { e.preventDefault(); }
        this.props.history.push("/bank");
    }

    renderU2FSuccessful = () => {
        return (
            <div className="__success">
                <p>Successful!</p>
                <Button onClick={this.advanceToBankingInterface}>Next</Button>
            </div>
        )
    }

    render() {
        return (
            <div className="U2FSignup">
                <h2>Register a Security Key</h2>
                <p>Insert your Security Key into a USB port and tap the button...</p>
                { this.state.u2fCompleted ? this.renderU2FSuccessful() :  <LoadingSpinner /> }
            </div>
        )
    }

}

export default withRouter(U2FSignup);
