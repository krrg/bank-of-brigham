import React from "react";
import BankStore from "../../../stores/BankStore";

import "./Transfers.scss";


export default class Payments extends React.Component {

    constructor() {
        super();

        this.state = {
            accounts: BankStore.getState().accounts,
            from: null,
            amount: null,
        }
    }

    renderPayees = () => {
        return (
            <div className="Payees">
                <select>
                    <option>Gas Company</option>
                    <option>Electric Company</option>
                    <option>High-speed Internet Provider</option>
                    <option>Landlord / Rent Payment</option>
                </select>
            </div>
        )
    }

    render() {
        return (
            <div className="Payments">
                <div className="section-box container">
                    <div className="__header">
                        <h2>Payments</h2>
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

                            <br />

                        </form>

                    </div>
                </div>
            </div>
        )
    }

}

