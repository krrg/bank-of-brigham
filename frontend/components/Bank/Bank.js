import React from "react";
import ReactDOM from "react-dom";
import HeaderBar from "./HeaderBar/HeaderBar";

import AccountOverview from "./AccountOverview/AccountOverview";

import "./Bank.scss";

class BankIndex extends React.Component {

    constructor() {
        super();

        this.mockAccounts = [{
            id: 234,
            displayName: "Online Savings",
            type: "savings",
            balance: 10000
        }, {
            id: 235,
            displayName: "Interest Checking",
            type: "checking",
            balance: 2400
        }]
    }

    render() {
        return (
            <div className="BankIndex">
                <HeaderBar />

                <div className="BankIndex__content">
                    <AccountOverview accounts={this.mockAccounts} />
                </div>

            </div>
        )
    }

}

export default BankIndex;