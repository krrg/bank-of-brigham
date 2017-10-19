import React from "react";

import "./HeaderBar.scss";

export default class HeaderBar extends React.Component {

    render() {
        return (
            <div className="HeaderBar">
                <div className="HeaderBar__content">
                    <a className="__logo">
                        <img src="/img/bankiconhex_white.png" />
                        <h1>Bank of Brigham</h1>
                    </a>
                </div>
            </div>
        )
    }

}