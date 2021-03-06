import React from "react";
import { withRouter } from "react-router-dom";
import LoginActions from "../../../actions/LoginActions";
import LoginStore from "../../../stores/LoginStore";
import { Button } from "react-foundation";
import ErrorWrapper from "../../ErrorWrapper";


export const TotpVerifyBoxWrapper = () => {
    return (
        <div>
            <h2>Verification Code</h2>
            <TotpVerifyBox />
        </div>
    )
}

import "./TotpVerifyBox.scss";
import { LoginApiHelpers } from "../../../api/LoginApi";

class TotpVerifyBox extends React.Component {

    constructor() {
        super();
        this.state = {
            fullyAuthenticated: false,
            errorMessage: "",
            isErrored: false,
        }
    }

    handleVerifyTotpCode = (e) => {
        if (e) { e.preventDefault() }
        const code = this.refs.code.value;
        LoginActions.loginTotp(code);
    }

    handleLoginStoreUpdated = (storeState) => {
        console.log("Store state: ", storeState);

        this.setState({
            fullyAuthenticated: storeState["authenticationLevel"] === "full",
            errorMessage: storeState["errorMessage"],
            isErrored: !! storeState["errorMessage"],
        })

        if (this.state.fullyAuthenticated) {
            setTimeout(() => {
                this.props.history.push("/bank");
            }, 0);
        }
    }

    componentDidMount() {
        LoginStore.listen(this.handleLoginStoreUpdated);
        LoginApiHelpers.beginLoginTotp();
    }

    componentWillUnmount() {
        LoginStore.unlisten(this.handleLoginStoreUpdated);
    }

    render() {
        return (
            <div className="TotpVerifyBox">
                <p>Please use your authenticator app to generate a six-digit code and enter it below:</p>
                <form className="__form" onSubmit={this.handleVerifyTotpCode}>
                    <ErrorWrapper isErrored={this.state.isErrored} message={this.state.errorMessage}>
                        <input type="text" placeholder="000000" ref="code"/>
                        <Button type="submit">Submit</Button>
                    </ErrorWrapper>
                </form>
            </div>
        )
    }

}

export default withRouter(TotpVerifyBox);
