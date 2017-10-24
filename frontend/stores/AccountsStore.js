import AltInstance from "../alt";
import AccountsActions from "../actions/AccountsActions";
import { AccountsSource } from "../api/AccountsApi";


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
        this.setState({
            accounts: _.sortBy(result["accounts"], a => a["type"])
        })
    }
}

const AltAccountsStore = AltInstance.createStore(AccountsStore, 'AccountsStore');
export default AltAccountsStore;
