import React from "react";
import PropTypes from "prop-types";
import Select from "react-select";
import Accounting from "../../../lib/accounting";

import BankStore from "../../../stores/BankStore";
import BankActions from "../../../actions/BankActions";

import { TAccountList, accountTypesMap } from "../../../constants";


import "./Transfers.scss";

const ColorBlock = ({color}) => {
    return (
        <span style={{
            backgroundColor: color,
        }} className="__colorBlock">
        </span>
    )
}

const TransferOption = (props) => {
    const account = props.option;

    if (! account) {
        return <p>null</p>
    }


    const color = accountTypesMap[account["type"]]["color"];
    const accountNumber = account["number"].toString();

    return (
        <div className="TransferOption">
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

export default class Transfers extends React.Component {

    constructor() {
        super();

        this.state = {
            accounts: BankStore.getState().accounts,
            to: null,
            from: null,
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

    renderAccountDropdown = () => {
        const options = this.state.accounts.map(a => {
            return _.merge({}, a, {
                "value": a["id"]
            })
        });

        return (
            <Select
                options={options}
                optionComponent={TransferOption}
                maxHeight={10}
            />
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

                    <div className="__content">
                        <form>
                            <p>Transfer from:</p>
                            { this.renderAccountDropdown() }
                            <br />
                            <p>Transfer to:</p>
                            { this.renderAccountDropdown() }
                        </form>

                    </div>
                </div>
            </div>
        )
    }

}
