import React from "react";
import SmsVerifyBox from "../../Login/2fa/SmsVerifyBox";

import "./SmsSignupVerify.scss";

export default class SmsSignupVerify extends React.Component {

    render() {
        return (
            <div className="SmsSignupVerify">
                <div className="__content">
                    {/* This is the same component used in the login. */}
                    <SmsVerifyBox />
                </div>
            </div>
        )
    }

}
