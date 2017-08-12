import React from "react";
import * as F from "react-foundation";

import "./Login.scss";

export default class Login extends React.Component {

    render() {
        return (
            <div className="Login">
                <div className="x-vertical-center">
                    <h1>Bank of Brigham</h1>

                    <form>
                        <label htmlFor="Login__username">Username</label>
                        <input type='text' id="Login__username" className="Login__username" placeholder="Username" />
                        <label htmlFor="Login__password">Password</label>
                        <input type='password' id="Login__password" className="Login__password" placeholder="Password" />

                        <F.Button className="Login__submit">Submit</F.Button>
                    </form>
                </div>

            </div>
        )
    }

}