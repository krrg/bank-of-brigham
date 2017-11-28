import React from "react";
import LoginActions from "../../actions/LoginActions";

import "./Logout.scss";

export default class Logout extends React.Component {

    componentDidMount() {
        LoginActions.logout();
    }

    render() {
        return (
            <div className="Logout container">
                <p>You have been logged out.</p>
            </div>
        )
    }

}
