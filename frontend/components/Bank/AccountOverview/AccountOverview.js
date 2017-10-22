import React from "react";
import PropTypes from "prop-types";
import FancyPieChart from "./FancyPieChart";
import AccountListPropType from "../AccountsListPropType";
import _ from "lodash";

import Accounting from "../../../lib/accounting";

import "./AccountOverview.scss";

export default class AccountOverview extends React.Component {


    static propTypes = {
        accounts: AccountListPropType
    }

    renderColorBlockTd = (color, type) => {
        if (type === "th") {
            return <td style={{width: "1em", backgroundColor: color}}></td>
        } else {
            return <th style={{width: "1em", backgroundColor: color}}></th>
        }
    }


    renderSingleAccount = (accountObj) => {
        return (
            <tr className="AccountRow" key={accountObj["id"]}>
                <td>{ accountObj["displayName"] }</td>
                {/* <td>{ accountObj["type"] }</td> */}
                <td>{ Accounting.formatMoney(accountObj["balance"]) }</td>
                { this.renderColorBlockTd(accountObj["color"]) }
            </tr>
        )
    }

    renderRows = () => {
        return (
            <div className="__rows">
                <table>
                    <thead>
                        <tr>
                            <th>Account</th>
                            {/* <th></th> */}
                            <th>Available</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                    {(this.props.accounts || []).map(account =>
                        this.renderSingleAccount(account)
                    )}
                    </tbody>
                    <tfoot>
                        <tr>
                            {/* <td></td> */}
                            <td className="__total">Total:</td>
                            <td>{ Accounting.formatMoney(_.sumBy(this.props.accounts, a => a["balance"])) }</td>
                            {<td></td>}
                        </tr>
                    </tfoot>
                </table>
            </div>
        )
    }

    render() {
        return (
            <div className="AccountOverview">
                <div className="__header">
                    <h2>Account Overview</h2>
                </div>

                <div className="__content">
                    <FancyPieChart accounts={this.props.accounts} />

                    { this.renderRows() }
                </div>
            </div>
        )
    }

}

