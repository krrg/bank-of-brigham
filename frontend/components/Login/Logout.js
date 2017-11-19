import React from "react";
import LoginActions from "../../actions/LoginActions";

export default class Logout extends React.Component {

    componentDidMount() {
        LoginActions.logout();
    }

    render() {
        return (
            <div>
                <p>You have been logged out.</p>
            </div>
        )
    }

}
