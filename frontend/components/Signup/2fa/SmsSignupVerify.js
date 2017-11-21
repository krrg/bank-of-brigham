import React from "react";
import SmsVerifyBox from "../../Login/2fa/SmsVerifyBox";
import SignupStore from "../../../stores/SignupStore";
import { withRouter } from "react-router-dom";
import LoginStore from "../../../stores/LoginStore";


import "./SmsSignupVerify.scss";

class SmsSignupVerify extends React.Component {

    handleLoginStoreUpdated = (storeState) => {
        /* See if we made it all the way through */
        if (storeState["authenticationLevel"] === "full") {
            setTimeout(() => {
                this.props.history.push("/bank");
            }, 0);
        }
    }

    componentDidMount() {
        LoginStore.listen(this.handleLoginStoreUpdated);
    }

    componentWillUnmount() {
        LoginStore.unlisten(this.handleLoginStoreUpdated);
    }

    render() {
        return (
            <div className="SmsSignupVerify">
                <div className="__content">
                    {/* This is the same component used in the login. */}
                    <SmsVerifyBox code={SignupStore.getState()["lastPhoneDigits"]}/>
                </div>
            </div>
        )
    }

}

export default withRouter(SmsSignupVerify)
