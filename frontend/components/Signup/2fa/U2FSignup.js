import React from "react";
import SignupStore from "../../../stores/SignupStore";
import SignupActions from "../../../actions/SignupActions";
import LoadingSpinner from "../../LoadingSpinner";

import "./U2FSignup.scss";

class U2FSignup extends React.Component {

    componentDidMount() {
        SignupStore.listen
        SignupActions.signupU2F();
    }

    render() {
        return (
            <div className="U2FSignup">
                <h2>Register a Security Key</h2>
                <p>Insert your Security Key into a USB port and tap the button...</p>
                <LoadingSpinner />
            </div>
        )
    }

}

export default U2FSignup;
