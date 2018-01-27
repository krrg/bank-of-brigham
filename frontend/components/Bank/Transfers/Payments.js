import React from "react";
import BankStore from "../../../stores/BankStore";
import BankActions from "../../../actions/BankActions";
import { BankApi } from "../../../api/BankApi";
import AccountDropdown from "./AccountDropdown";
import { Button } from "react-foundation";
import classNames from "classnames";
import ErrorWrapper from "../../ErrorWrapper";

import "./Transfers.scss";
import { withRouter } from "react-router-dom";


class Payments extends React.Component {

    constructor() {
        super();

        this.state = {
            accounts: BankStore.getState().accounts,
            from: null,
            amount: null,
            error: null,
        }
    }



    renderPayees = () => {
        return (
            <div className="Payees">
                <select defaultValue="" onInput={(e) => this.setState({payee: e.target.value})}>
                    <option></option>
                    <option value="1">Covered Wagon Internet Co.</option>
                    <option value="1">Granite Gas Corp.</option>
                    <option value="1">Monolithic Monopoly Property Management LLC</option>
                    <option value="1">Gray Smog Power and Light</option>
                </select>
            </div>
        )
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

        try {
            await BankApi.postPayment(amountCents, fromId);
            this.props.history.push("/bank");

        } catch (e) {
            this.setState({
                error: e
            })
        }

        /* Now redirect */
    }

    renderSubmitButton = () => {
        const allRequiredFieldsFilled = _.every([
            !! this.state.amount,
            !! this.state.from,
            !! this.state.payee
        ])

        console.log("Rendering submit button!!!!!", allRequiredFieldsFilled);
        console.log("Here is my state: ", this.state);

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
            <div className="Payments">
                <div className="section-box container">
                    <div className="__header">
                        <h2>Payments</h2>
                    </div>

                    <div className="__content clearfix">
                        <ErrorWrapper
                            isErrored={!! this.state.error}
                            message="Payment failed, do you have enough money in that account? "
                        >
                            <form onSubmit={this.handleTransferSubmit}>

                                <p>Transfer from:</p>
                                <AccountDropdown
                                    accounts={this.state.accounts}
                                    handleSelectChanged={(s) => this.setState({from: s.account})}
                                />
                                <hr />

                                <p>Pay to:</p>
                                { this.renderPayees() }

                                <br />

                                <p>Amount</p>
                                <span className="input-group">
                                    <span className="input-group-label">$</span>
                                    <input
                                        className="input-group-field"
                                        ref={input => this.money = input}
                                        type="number"
                                        step="0.01"
                                        onInput={(e) => {this.setState({amount: e.target.value})}}
                                    />
                                </span>
                                <hr />

                                { this.renderSubmitButton() }
                                <br />
                            </form>
                        </ErrorWrapper>

                    </div>
                </div>
            </div>
        )
    }

}

export default withRouter(Payments);

