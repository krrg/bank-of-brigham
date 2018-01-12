import React from "react";
import PropTypes from "prop-types";
import Select from "react-select";
import Accounting from "../../../lib/accounting";

import BankStore from "../../../stores/BankStore";
import BankActions from "../../../actions/BankActions";
import { BankApi } from "../../../api/BankApi";

import { TAccountList, accountTypesMap } from "../../../constants";
import { Button } from "react-foundation";
import classNames from "classnames";
import { withRouter } from "react-router-dom";

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

class Transfers extends React.Component {

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

    handleTransferSubmit = async (e) => {
        if (e) { e.preventDefault(); }
        const amountCents = Math.floor(this.money.value * 100);

        const fromId = this.state.from;
        const toId = this.state.to;
        await BankApi.postTransfer(amountCents, fromId, toId);

        /* Now redirect */
        this.props.history.push("/bank");
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

    renderSubmitButton = () => {
        const allRequiredFieldsFilled = _.every([
            !! this.money && this.money.value,
            !! this.state.to,
            !! this.state.from,
        ])

        return (
            <Button
                type="submit"
                className={classNames("float-right", {"disabled": ! allRequiredFieldsFilled})}
            >
            Submit
            </Button>
        )
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

                    <div className="__content clearfix">
                        <form onSubmit={this.handleTransferSubmit}>
                            <p>Amount</p>
                            <span className="input-group">
                                <span className="input-group-label">$</span>
                                <input
                                    className="input-group-field"
                                    ref={input => this.money = input}
                                    type="number"
                                    step="0.01"
                                />
                            </span>
                            <hr />

                            <p>Transfer from:</p>
                            { this.renderAccountDropdown("from") }
                            <hr />

                            <p>Transfer to:</p>
                            { this.renderAccountDropdown("to") }

                            <br />
                            { this.renderSubmitButton() }

                        </form>

                    </div>
                </div>
            </div>
        )
    }

}

export default withRouter(Transfers)
