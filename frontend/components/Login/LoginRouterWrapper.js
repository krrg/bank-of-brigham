import React from "react";
import { withRouter } from "react-router-dom";
import LoginActions from "../../actions/LoginActions";
import LoginStore from "../../stores/LoginStore";
import LoginPassword from "./LoginPassword";
import Login2FA from "./Login2FA";


class LoginRouterWrapper extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            authenticationLevel: null,
            secondFactor: null,
        };
    }

    componentDidUpdate(prevProps, prevState) {
        console.log("Previous state: ", prevState);
        console.log("Current state", this.state);

        if (prevState.authenticationLevel !== this.state.authenticationLevel) {
            if (this.state.secondFactor && this.state.authenticationLevel === "password") {
                this.beginSecondFactorVerify(this.state.secondFactor);
            }
            this.routeOnAuthenticationLevel();
        }

    }

    beginSecondFactorVerify = (secondFactor) => {
        setTimeout(() => {
            switch (secondFactor) {
                case "sms": LoginActions.beginSms()
            }
        }, 0);
    }

    handleLoginStoreUpdated = (storeState) => {
        this.setState({
            authenticationLevel: storeState["authenticationLevel"],
            secondFactor: storeState["secondFactor"],
        })
    }

    routeOnAuthenticationLevel = () => {
        setTimeout(() => {
            if (this.state.authenticationLevel === "full") {
                this.props.history.push("/bank");
            } else if (this.state.authenticationLevel === "password") {
                if (this.state.secondFactor === null) {
                    this.props.history.push("/bank");
                } else {
                    this.props.history.push("/login/2");
                }
            } else {
                this.props.history.push("/login/1");
            }
        }, 0);
    }

    componentDidMount = () => {
        LoginStore.listen(this.handleLoginStoreUpdated);
    }

    componentWillUnmount = () => {
        LoginStore.unlisten(this.handleLoginStoreUpdated);
    }

    renderConditionalAuthenticationStep() {
        if (this.state.authenticationLevel === "password") {
            return <Login2FA secondFactor={this.state.secondFactor} />
        } else { /* Including if we're already logged in and we come back out to here */
            return <LoginPassword />
        }
    }

    render() {
        return (
            <div className="Login">
                {/* Authentication: { this.state.authenticationLevel }
                Second factor: { this.state.secondFactor } */}
                <div className="x-vertical-center">
                    { this.renderConditionalAuthenticationStep() }
                </div>
            </div>
        )
    }

}

export default withRouter(LoginRouterWrapper);
