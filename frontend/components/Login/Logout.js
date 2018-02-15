import React from "react";
import LoginActions from "../../actions/LoginActions";
import { Link } from "react-router-dom";
import { Button } from "react-foundation";

import "./Logout.scss";

export default class Logout extends React.Component {

    componentDidMount() {
        LoginActions.logout();
    }

    render() {
        return (
            <div className="Logout container">
                <p>Thank you for using the Bank of Brigham.</p>
                <Button><Link to="/">Login again</Link></Button>
            </div>
        )
    }

}
