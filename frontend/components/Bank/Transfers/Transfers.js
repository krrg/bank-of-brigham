import React from "react";
import Select from "react-select";

import BankStore from "../../../stores/BankStore";
import BankActions from "../../../actions/BankActions";
import { BankApi } from "../../../api/BankApi";

import { Button } from "react-foundation";
import classNames from "classnames";
import { withRouter } from "react-router-dom";

import TransferOption from "./TransferOption";
import AccountDropdown from "./AccountDropdown";

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

    handleTransferSubmit = async (e) => {
        if (e) { e.preventDefault(); }
        const amountCents = Math.floor(this.money.value * 100);

        const fromId = this.state.from;
        const toId = this.state.to;
        await BankApi.postTransfer(amountCents, fromId, toId);

        /* Now redirect */
        this.props.history.push("/bank");
    }

    handleFromUpdated = (newState) => {
        console.log("It is falling [from]!", newState);
        this.setState({
            "from": newState["account"]
        })
    }

    handleToUpdated = (newState) => {
        console.log("It is falling [to]!", newState);
        this.setState({
            "to": newState["account"]
        })
    }

    handleValueUpdated = (e) => {
        this.setState({
            moneyValue: e.target.value,
        })
    }

    renderSubmitButton = () => {
        const allRequiredFieldsFilled = _.every([
            !! this.money && this.money.value,
            !! this.state.to,
            !! this.state.from,
        ])

        console.log("Money: ", this.money)
        console.log("To:", this.state.to)
        console.log("From:", this.state.from);

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
                                    onInput={this.handleValueUpdated}
                                />
                            </span>
                            <hr />

                            <p>Transfer from:</p>
                                <AccountDropdown
                                    accounts={this.state.accounts}
                                    handleSelectChanged={this.handleFromUpdated}
                                />
                            <hr />

                            <p>Transfer to:</p>
                                <AccountDropdown
                                    accounts={this.state.accounts}
                                    handleSelectChanged={this.handleToUpdated}
                                />
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
