import React from "react";

export default class SmsVerifyBox extends React.Component {

    handleVerificationCodeSubmit = (e) => {
        if (e) { e.preventDefault() }

        console.log("Just entered ", this.refs.code.value);
    }

    render() {
        return (
            <div className="SmsVerifyBox">
                <h2>Enter code</h2>
                <p>We've sent a verification code to (***) ***-**{digits}</p>
                <form onSubmit={this.handleVerificationCodeSubmit}>
                    <input type="text" placeholder="Code" ref="code"/>
                </form>
            </div>
        )
    }

}
