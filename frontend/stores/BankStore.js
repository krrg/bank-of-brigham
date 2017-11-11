import AltInstance from "../alt";
import BankActions from "../actions/BankActions";
import { BankSource } from "../api/BankApi";
import { accountTypes } from "../constants";

import _ from "lodash";


function getAuthToken() {
    return null;
}

class BankStore {
    constructor() {
        this.state = {
            accounts: null
        }

        this.registerAsync(BankSource);
        this.bindAction(BankActions.getAccounts, this.handleGetAccounts);
        this.bindAction(BankActions.getAccountsCompleted, this.handleGetAccountsCompleted);
    }

    handleGetAccounts = () => {
        if (! this.getInstance().isLoading()) {
            this.getInstance().fetchAccounts(getAuthToken())
        }
    }

    handleGetAccountsCompleted = (result) => {
        const accounts = result["accounts"];
        const ordering = _.fromPairs(accountTypes.map(accountType => {
            return [accountType["key"], accountType["color"]];
        }));

        this.setState({
            accounts: _.sortBy(accounts, a => ordering[a["type"]]),
        })
    }
}

const AltStore = AltInstance.createStore(BankStore, 'BankStore');
export default AltStore;
