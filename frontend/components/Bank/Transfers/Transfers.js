import React from "react";
import PropTypes from "prop-types";
import Select from "react-select";
import Accounting from "../../../lib/accounting";

import BankStore from "../../../stores/BankStore";
import BankActions from "../../../actions/BankActions";

import { TAccountList, accountTypesMap } from "../../../constants";

import * as F from "react-foundation";


import "./Transfers.scss";

const ColorBlock = ({color}) => {
    return (
        <span style={{
            backgroundColor: color,
        }} className="__colorBlock">
        </span>
    )
}


class TransferOption extends React.Component {

    onMouseMove = (e) => {
        if (this.props.isFocused) {
            return;
        }
        if (this.props.onFocus) {
            this.props.onFocus(this.props.option, e);
        }
    }

    onMouseEnter = (e) => {
        if (this.props.onFocus) {
            this.props.onFocus(this.props.option, e);
        }
    }

    onMouseDown = (e) => {
        if (e) { e.preventDefault(); }
        if (this.props.onSelect) {
            this.props.onSelect(this.props.option, e);
        }
    }

    render() {
        const account = this.props.option || this.props.value;

        if (! account) {
            return <option>null sandwich</option>
        }


        const color = accountTypesMap[account["type"]]["color"];
        const accountNumber = account["number"].toString();

        return (
            <div
                className="TransferOption"
                onMouseMove={this.onMouseMove}  /* onClick was broken by the author of React-Select, not sure of details why? Strange. */
                onMouseDown={this.onMouseDown}
                onMouseEnter={this.onMouseEnter}
            >
                <ColorBlock color={color} />
                <span className="__displayName">{account["displayName"]}</span>
                <span className="__accountNumber">
                    { accountNumber.substring(accountNumber.length - 4) }
                </span>
                <span className="__lineEnd">
                    <span className="__balance">
                        { Accounting.formatMoney(account["balance"]) }
                    </span>
                    <ColorBlock color={color} />
                </span>
            </div>
        )
    }
}

export default class Transfers extends React.Component {

    constructor() {
        super();

        this.state = {
            accounts: BankStore.getState().accounts,
            to: null,
            from: null,
            amount: 0,
        }
    }

    handleAccountsStoreUpdated = (storeState) => {
        this.setState({
            accounts: storeState.accounts
        })
    }

    componentDidMount() {
        BankStore.listen(this.handleAccountsStoreUpdated);
        BankActions.getAccounts();
    }

    componentWillUnmount() {
        BankStore.unlisten(this.handleAccountsStoreUpdated);
    }

    handleSelectChanged = (stateKey, option, e) => {
        const newState = {};
        newState[stateKey] = option.id;  // Maybe supposed to be the id?  // TODO TODO TODO TODO TODO Look here very closely.  Something is broken.
        this.setState(newState);
    }

    renderAccountDropdown = (stateKey) => {
        const self = this; /* Not sure how far `this` would go. */
        const options = this.state.accounts.map(a => {
            return _.merge({}, a, {
                "value": a["id"],
            })
        });

        return (
            <Select
                options={options}
                optionComponent={TransferOption}
                maxHeight={10}
                value={this.state[stateKey]}
                valueComponent={TransferOption}
                onChange={(option, e) => {this.handleSelectChanged(stateKey, option, e)}}
                clearable={false}
                arrowRenderer={this.state[stateKey] ? null : undefined}
                inputRenderer={this.state[stateKey] ? undefined : undefined}
                multi={false}
                searchable={false}
            />
        )
    }

    onMoneyInputChange = (e) => {
        const value = e.target.value;
        if (value.startsWith("$")) {
            const newValue = Number.parseFloat(value.replace("$", ""));
            if (isNaN(newValue)) {
                this.setState({
                    amount: ""
                })
            } else {
                this.setState({
                    amount: newValue
                })
            }

        }
    }

    render() {
        if (! this.state.accounts) {
            return null;
        }

        return (
            <div className="Transfers">
                <div className="section-box">
                    <div className="__header">
                        <h2>Transfers</h2>
                    </div>

                    <div className="__content">
                        <form>
                            <p>Transfer from:</p>
                            { this.renderAccountDropdown("from") }

                            <p>Amount</p>
                            <F.Row collapseOnSmall={true}>
                                <F.Column small={3} large={2}>
                                    <span className="prefix">This</span>
                                </F.Column>
                                <F.Column small={9} large={10}>
                                    <input type="text" placeholder="Enter your URL..." className="radius" />
                                </F.Column>
                            </F.Row>

                            <p>Transfer to:</p>
                            { this.renderAccountDropdown("to") }
                        </form>

                    </div>
                </div>
            </div>
        )
    }

}
