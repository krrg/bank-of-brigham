import React from "react";
import Select from "react-select";

import BankStore from "../../../stores/BankStore";
import BankActions from "../../../actions/BankActions";
import { BankApi } from "../../../api/BankApi";

import { Button } from "react-foundation";
import classNames from "classnames";
import { withRouter } from "react-router-dom";

import TransferOption from "./TransferOption";

import "./Transfers.scss";



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
