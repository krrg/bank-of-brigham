import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import HeaderBar from "./HeaderBar/HeaderBar";
import AccountOverview from "./AccountOverview/AccountOverview";
import DetailsList from "./DetailsList/DetailsList";

import _ from "lodash";

import "./Bank.scss";


class BankIndex extends React.Component {

    constructor() {
        super();

        this.mockAccounts = [{
            id: 234,
            number: "72321123",
            displayName: "Online Savings",
            type: "savings",
            balance: 10000
        }, {
            id: 290,
            number: "345345211",
            displayName: "Business Checking",
            type: "checking",
            balance: 2303.23
        }, {
            id: 235,
            number: "349349494",
            displayName: "Interest Checking",
            type: "checking",
            balance: 2400
        }, {
            id: 240,
            number: "223989224",
            displayName: "Money Market",
            type: "moneymarket",
            balance: 3500
        }, {
            id: 988,
            number: "2039282104",
            displayName: "High Yield Certificate",
            type: "certificate",
            balance: 4050.30
        }];

        this.mockAccounts = _.sortBy(this.mockAccounts, a => a["type"]);
    }

    render() {
        return (
            <div className="BankIndex">
                <div className="BankIndex__content">
                    <AccountOverview accounts={this.mockAccounts} />
                    <DetailsList accounts={this.mockAccounts} />
                </div>
            </div>
        )
    }

}

export default BankIndex;