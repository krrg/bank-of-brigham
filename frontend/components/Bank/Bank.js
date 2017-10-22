import React from "react";
import ReactDOM from "react-dom";
import HeaderBar from "./HeaderBar/HeaderBar";
import AccountOverview from "./AccountOverview/AccountOverview";

import _ from "lodash";

import "./Bank.scss";

function assignAccountColor(account) {
    const colors = {
        "checking": "#F1C40F",
        "savings": "#A04000",
        "certificate": "#D68910",
        "moneymarket": "#6E2C00"
    }

    const accountCopy = _.cloneDeep(account)
    const assignedColor = colors[accountCopy["type"]]
    accountCopy["color"] = assignedColor;
    return accountCopy;
}

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
        }, {
            id: 240,
            displayName: "Money Market",
            type: "certificate",
            balance: 3500
        }]

        this.mockAccounts = this.mockAccounts.map(assignAccountColor);
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