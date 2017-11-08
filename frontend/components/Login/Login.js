import React from "react";
import * as F from "react-foundation";

import "./Login.scss";

export default class Login extends React.Component {

    handlePasswordSubmit = (e) => {
        if (e) {
            e.preventDefault();
        }

        const username = this.refs.username.value.toLowerCase();
        const password = this.refs.password.value; /* do not modify password at all, including stripping spaces. */

        LoginActions.loginPassword(username, password);
    }

    render() {
        return (
            <div className="Login">
                <div className="x-vertical-center">
                    <div className="LoginBox">
                        <img src="/img/bankiconhex.png" />
                        <div>
                            <h1>Bank of Brigham</h1>
                            <form action={}>
                                <label htmlFor="Login__username">Username</label>
                                <input type='text' id="Login__username" ref="username" className="Login__username" placeholder="Username" />
                                <label htmlFor="Login__password">Password</label>
                                <input type='password' id="Login__password" ref="password" className="Login__password" placeholder="Password" />

                                <F.Button className="Login__submit">Submit</F.Button>
                            </form>
                        </div>

                    </div>
                </div>

            </div>
        )
    }

}
