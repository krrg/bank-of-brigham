import React from "react";
import { Link } from "react-router-dom";

import "./HeaderBar.scss";

export default class HeaderBar extends React.Component {

    render() {
        return (
            <div className="HeaderBar">
                <div className="HeaderBar__content">
                    <Link to="/bank" className="__logo">
                        <img src="/img/bankiconhex_white.png" />
                        <h1>Bank of Brigham</h1>
                    </Link>

                    <div className="__rightLinks">
                        <Link to="/bank/transfers">Payments</Link>
                        <Link to="/bank/transfers">Transfers</Link>
                        <Link to="/bank/messages">Settings</Link>
                        <Link to="/logout">Logout</Link>
                    </div>

                </div>
            </div>
        )
    }

}