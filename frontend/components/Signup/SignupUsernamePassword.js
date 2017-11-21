import React from "react";
import { Button } from "react-foundation";
import { withRouter } from "react-router-dom";

import SignupActions from "../../actions/SignupActions";
import SignupStore from "../../stores/SignupStore";
import LoginActions from "../../actions/LoginActions";
import ErrorWrapper from "../ErrorWrapper";

import "./SignupUsernamePassword.scss";

class SignupUsernamePassword extends React.Component {

    constructor() {
        super();

        this.state = {
            errorPasswordNotMatch: false,
            errorUsernameAlreadyTaken: false,
        }
    }

    componentDidMount() {
        SignupStore.listen(this.handleSignupStoreUpdated);
        if (this.state.readyFor2faSelection) {
            this.props.history.push("/create/2");
        }
    }

    componentWillUnmount() {
        SignupStore.unlisten(this.handleSignupStoreUpdated);
    }

    handleSignupStoreUpdated = (storeState) => {
        this.setState({
            readyFor2faSelection: storeState.readyFor2faSelection,
            errorUsernameAlreadyTaken: SignupStore.getErrorStatus("usernameAlreadyTaken"),
        })

        if (this.state.readyFor2faSelection) {
            this.props.history.push("/create/2");
        }
    }

    resetErrorStates = () => {
        this.setState({
            errorPasswordNotMatch: false,
            errorUsernameAlreadyTaken: false,
        })
    }

    handleCreateAccount = (e) => {
        if (e) { e.preventDefault() }
        this.resetErrorStates();

        let errorState = false;

        const username = this.refs.username.value.trim().toLowerCase();
        if (username === "") {
            errorState = true;
            this.refs.username.value = "";
            this.setState({
                errorUsernameAlreadyTaken: true, /* Not exactly true, but... */
            })
        }

        const password1 = this.refs.password.value;
        const password2 = this.refs.password2.value;

        if (password1 !== password2 || password1 === "") {
            errorState = true;
            this.refs.password.value = "";
            this.refs.password2.value = "";
            this.setState({
                errorPasswordNotMatch: true,
            })
        }

        if (! errorState) {
            SignupActions.postSignup(username, password1);
        }

    }

    renderUsernamePassword = () => {
        return (
            <form className="__usernamePassword" onSubmit={this.handleCreateAccount}>
                <ErrorWrapper isErrored={this.state.errorUsernameAlreadyTaken} message="Username already taken, please choose another one.">
                    <label htmlFor="Login__username">Username </label>
                    <input type='text' id="Login__username" ref="username" className="Login__username" placeholder="Username" />
                </ErrorWrapper>

                <ErrorWrapper isErrored={this.state.errorPasswordNotMatch} message="Passwords do not match">
                    <label htmlFor="Login__password">Password</label>
                    <input type='password' id="Login__password" ref="password" className="Login__password" placeholder="Password" />
                    <input type='password' id="Login__password2" ref="password2" className="Login__password" placeholder="Verify Password" />
                </ErrorWrapper>

                <Button>Create Account</Button>
            </form>
        )
    }

    render() {
        return (
            <div className="SignupUsernamePassword">
                <div className="Signup__content">
                    <h2>Create an Account</h2>
                    { this.renderUsernamePassword() }

                </div>
            </div>
        )
    }

}

export default withRouter(SignupUsernamePassword);
