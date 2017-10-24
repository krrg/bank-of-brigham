import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import HeaderBar from "./HeaderBar/HeaderBar";
import AccountOverview from "./AccountOverview/AccountOverview";
import DetailsList from "./DetailsList/DetailsList";

import AccountsStore from "../../stores/AccountsStore";
import AccountsActions from "../../actions/AccountsActions";

import _ from "lodash";

import "./Bank.scss";


class BankIndex extends React.Component {

    constructor() {
        super();

        this.state = {
            accounts: AccountsStore.getState().accounts,
        }
    }

    handleAccountsStoreUpdated = (storeState) => {
        this.setState({
            accounts: storeState.accounts
        })
    }

    componentDidMount() {
        AccountsStore.listen(this.handleAccountsStoreUpdated);
        AccountsActions.get();
    }

    componentWillUnmount() {
        AccountsStore.unlisten(this.handleAccountsStoreUpdated);
    }

    render() {
        console.log("Accounts", this.state.accounts);

        if (! this.state.accounts) {
            return (<h1>Loading</h1>);
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