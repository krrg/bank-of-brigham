import React from "react";
import { withRouter } from "react-router-dom";
import { Button } from "react-foundation";
import LoginActions from "../../actions/LoginActions";
import LoginStore from "../../stores/LoginStore";
import ErrorWrapper from "../ErrorWrapper";

import "./Login.scss";

class Login extends React.Component {

    constructor() {
        super();
        this.state = {
            errorMessage: null,
        }
    }

    handlePasswordSubmit = (e) => {
        if (e) {
            e.preventDefault();
        }

        const username = this.refs.username.value;
        const password = this.refs.password.value;

        LoginActions.loginPassword(username, password);
    }

    handleLoginStoreUpdated = (storeState) => {
        this.setState({
            errorMessage: storeState['errorMessage']
        })
    }

    componentDidMount() {
        LoginStore.listen(this.handleLoginStoreUpdated);
    }

    componentWillUnmount() {
        LoginStore.unlisten(this.handleLoginStoreUpdated);
    }

    render() {
        return (
            <div className="LoginBox">
                <img src="/img/bankiconhex.png" />
                <div>
                    <h1>Bank of Brigham</h1>
                    <ErrorWrapper isErrored={!! this.state.errorMessage} message="Invalid username or password">
                        <form className="__loginForm" onSubmit={this.handlePasswordSubmit}>
                            <label htmlFor="Login__username">Username</label>
                            <input type='text' id="Login__username" ref="username" className="Login__username" placeholder="Username" />
                            <label htmlFor="Login__password">Password</label>
                            <input type='password' id="Login__password" ref="password" className="Login__password" placeholder="Password" />

                            <Button className="Login__submit">Login</Button>
                        </form>
                    </ErrorWrapper>
                </div>
            </div>
        )
    }

}

export default Login;
