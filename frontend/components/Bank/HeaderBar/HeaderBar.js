import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import "./HeaderBar.scss";


export default class HeaderBar extends React.Component {

    renderShowLinks = () => {
        if (this.props.showLinks === undefined || this.props.showLinks === true) {
            return (
                <div className="__rightLinks">
                    <Link to="/bank">Home</Link>
                    <Link to="/bank/payments">Payments</Link>
                    <Link to="/bank/transfers">Transfers</Link>
                    <Link to="/logout">Logout</Link>
                </div>
            )
        } else if (typeof(this.props.showLinks) === 'function') {
            return (
                <div className="__rightLinks">
                    { this.props.showLinks() }
                </div>
            )
        } else {
            return undefined;
        }
    }

    render() {
        return (
            <div className="HeaderBar">
                <div className="HeaderBar__content">
                    <Link to={this.props.link} className="__logo">
                        <img src="/img/bankiconhex_white.png" />
                        <div className="__title">
                            <h1>Bank of Brigham</h1>
                            { this.props.tagline ? <p>{ this.props.tagline }</p> : undefined }
                        </div>
                    </Link>

                    { this.renderShowLinks() }

                </div>
            </div>
        )
    }

}
