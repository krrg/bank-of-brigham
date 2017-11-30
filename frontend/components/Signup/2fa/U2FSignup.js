import React from "react";
import SignupActions from "../../../actions/SignupActions";
import LoadingSpinner from "../../LoadingSpinner";

import "./U2FSignup.scss";

class U2FSignup extends React.Component {

    componentDidMount() {
        console.log("Looking for key...");
        SignupActions.signupU2F();
    }

    render() {
        return (
            <div className="U2FSignup">
                <h2>Register U2F Device</h2>
                <LoadingSpinner />
            </div>
        )
    }

}

export default U2FSignup;
