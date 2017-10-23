import React from "react";
import { accountTypes, accountTypesMap, TAccountList } from "../../../constants";
import Accounting from "../../../lib/accounting";
import { Link } from "react-router-dom";

import "./DetailsList.scss";

export default class DetailsList extends React.Component {

    static propTypes = {
        accounts: TAccountList
    }

    renderAccountNumber = (accountNumber) => {
        const accountNumberStr = accountNumber.toString();
        return (
            <span className="AccountNumber">
                { accountNumberStr.substring(accountNumberStr.length - 4) }
            </span>
        )
    }

    renderAccountRow = (account, color) => {
        const reactKey = `account-${account["id"]}-${account["balance"]}`;
        return (
            <tr className="__row" key={reactKey}>
                <td style={{width: "1em", backgroundColor: color}}></td>
                <td className="__displayName">
                    {account["displayName"]} (...{this.renderAccountNumber(account["number"])})
                </td>
                <td className="__interestYTD">{Accounting.formatMoney(account["interestYTD"])}</td>
                <td className="__apy">{Accounting.toFixed(account["apy"], 2)}%</td>
                <td className="__balance">{Accounting.formatMoney(account["balance"])}</td>
            </tr>
        )
    }

    renderTotalRow = (total) => {
        return (
            <tr className="TotalRow">
                <td></td>
                <td className="__displayName"></td>
                <td className="__interestYTD"></td>
                <td className="__apy">Total:</td>
                <td className="__balance">{Accounting.formatMoney(total)}</td>
            </tr>
        )
    }

    renderTypeRow = (accountTypeObj) => {
        const filteredAccounts = this.props.accounts.filter(account => account["type"] === accountTypeObj["key"]);

        if (filteredAccounts.length === 0) {
            return null;
        }

        const typeKey = accountTypeObj["key"];
        const reactKey = `${typeKey}-${filteredAccounts.map(a => a["balance"]).join("-")}`;
        const color = accountTypesMap[typeKey]["color"];
        const totalBalance = _.sumBy(filteredAccounts, a => a["balance"]);

        return (
            <div className="__content" key={reactKey}>


                <table className="__headerTable">
                    <thead>
                        <tr>
                            <th className="__accountType"><h3>{ accountTypeObj["displayName"] }</h3></th>
                            <th className="__displayName"></th>
                            <th className="__interestYTD">Interest YTD</th>
                            <th className="__apy">APY</th>
                            <th className="__balance">Available</th>
                        </tr>
                    </thead>
                </table>

                <table>

                    <tbody>
                    { filteredAccounts.map(a => this.renderAccountRow(a, color)) }
                    </tbody>
                    <tfoot>
                    { this.renderTotalRow(totalBalance) }
                    </tfoot>
                </table>

            </div>
        )
    }

    render() {
        return (
            <div className="DetailsList">
                <div className="__header">
                    <h2>Details</h2>
                </div>

                { accountTypes.map(this.renderTypeRow) }

            </div>
        )
    }

}

