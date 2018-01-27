import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import "./HeaderBar.scss";

const HeaderBar = ({showLinks, link}) => {

    if (showLinks === undefined) {
        showLinks = true;
    }

    return (
        <div className="HeaderBar">
            <div className="HeaderBar__content">
                <Link to={link} className="__logo">
                    <img src="/img/bankiconhex_white.png" />
                    <h1>Bank of Brigham</h1>
                </Link>

                {
                    showLinks ?
                    <div className="__rightLinks">
                        <Link to="/bank">Home</Link>
                        <Link to="/bank/payments">Payments</Link>
                        <Link to="/bank/transfers">Transfers</Link>
                        <Link to="/bank/messages">Settings</Link>
                        <Link to="/logout">Logout</Link>
                    </div>
                : undefined }

            </div>
        </div>
    )

}

export default HeaderBar;
