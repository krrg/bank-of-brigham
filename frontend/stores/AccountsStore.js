import AltInstance from "../alt";
import AccountsActions from "../actions/AccountsActions";
import { AccountsSource } from "../api/AccountsApi";
import { accountTypes } from "../constants";

import _ from "lodash";


function getAuthToken() {
    return null;
}

class AccountsStore {
    constructor() {
        this.state = {
            accounts: null
        }

        this.registerAsync(AccountsSource);
        this.bindAction(AccountsActions.get, this.handleGet);
        this.bindAction(AccountsActions.getCompleted, this.handleGetCompleted);
    }

    handleGet = () => {
        if (! this.getInstance().isLoading()) {
            this.getInstance().fetchAccounts(getAuthToken())
        }
    }

    handleGetCompleted = (result) => {
        const accounts = result["accounts"];
        const ordering = _.fromPairs(accountTypes.map(accountType => {
            return [accountType["key"], accountType["color"]];
        }));

        this.setState({
            accounts: _.sortBy(accounts, a => ordering[a["type"]]),
        })
    }
}

const AltAccountsStore = AltInstance.createStore(AccountsStore, 'AccountsStore');
export default AltAccountsStore;
