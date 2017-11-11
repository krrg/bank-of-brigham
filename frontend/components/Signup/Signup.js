import React from "react";
import * as F from "react-foundation";

import "./Signup.scss";

export default class Signup extends React.Component {

    static propTypes = {

    }

    renderUsernamePassword = () => {
        return (
            <form className="__usernamePassword" onSubmit={this.handlePasswordSubmit}>
                <label htmlFor="Login__username">Username</label>
                <input type='text' id="Login__username" ref="username" className="Login__username" placeholder="Username" />
                <label htmlFor="Login__password">Password</label>
                <input type='password' id="Login__password" ref="password" className="Login__password" placeholder="Password" />
                <input type='password' id="Login__password2" ref="password2" className="Login__password" placeholder="Verify Password" />
            </form>
        )
    }

    TwoFactorButton = ({displayText, onClickHandler}) => {
        return (
            <F.Button className="TwoFactorButton" onClick={onClickHandler}>
                { displayText }
            </F.Button>
        )
    }

    renderTwoFactorSelectorList = () => {

        const groups = [ "1", "2", "3", "4", "5" ]

        return (
            <div>
                <p>Please select your assigned study group:</p>
                <div className="TwoFactorSelectorList">
                    {groups.map(displayText => <this.TwoFactorButton displayText={displayText} key={`k${displayText}`}/>)}
                </div>
            </div>
        )
    }

    render() {
        return (
            <div className="Signup">
                <div className="Signup__content">
                    <h2>Create an Account</h2>

                    { this.renderUsernamePassword() }
                    { this.renderTwoFactorSelectorList() }

                </div>
            </div>
        )
    }

}
