import AltInstance from "../alt";

class AccountsStore {
    constructor() {
        this.state = {
            accounts: []
        }

        this.bindListener()
    }
}

AltInstance.createStore(AccountsStore, 'AccountsStore');
