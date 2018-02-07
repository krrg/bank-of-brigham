import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import HeaderBar from "./HeaderBar/HeaderBar";
import AccountOverview from "./AccountOverview/AccountOverview";
import DetailsList from "./DetailsList/DetailsList";

import BankStore from "../../stores/BankStore";
import BankActions from "../../actions/BankActions";

import _ from "lodash";

import "./Bank.scss";


class BankIndex extends React.Component {

    constructor() {
        super();

        this.state = {
            accounts: BankStore.getState().accounts,
        }
    }

    handleBankStoreUpdated = (storeState) => {
        this.setState({
            accounts: storeState.accounts
        })
    }

    componentDidMount() {
        BankStore.listen(this.handleBankStoreUpdated);
        BankActions.getAccounts();
    }

    componentWillUnmount() {
        BankStore.unlisten(this.handleBankStoreUpdated);
    }

    render() {
        if (! this.state.accounts) {
            return null;
        }

        return (
            <div className="BankIndex">
                <div className="BankIndex__content">
                    <AccountOverview accounts={this.state.accounts} />
                    <DetailsList accounts={this.state.accounts} />
                </div>
            </div>
        )
    }

}

export default BankIndex;
