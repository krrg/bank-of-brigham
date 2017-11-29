import React from "react";
import { withRouter } from "react-router-dom";
import LoginActions from "../../../actions/LoginActions";
import LoginStore from "../../../stores/LoginStore";
import { Button } from "react-foundation";


class TotpVerifyBox extends React.Component {

    constructor() {
        super();
        this.state = {
            fullyAuthenticated: false,
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
            fullyAuthenticated: storeState["authenticationLevel"] === "full"
        })

        if (this.state.fullyAuthenticated) {
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
            <div className="TotpVerifyBox">
                <p>Please use your authenticator app to generate a six-digit code and enter it below:</p>
                <form onSubmit={this.handleVerifyTotpCode}>
                    <label>Verification code:</label>
                    <input type="text" placeholder="000000" ref="code"/>
                    <Button type="submit">Submit</Button>
                </form>
            </div>
        )
    }

}

export default withRouter(TotpVerifyBox);
