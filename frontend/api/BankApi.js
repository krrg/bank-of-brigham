import BankActions from "../actions/BankActions";
import axios from "axios";

export const BankSource = {

    fetchAccounts: {

        remote(state, authToken) {
            console.log("Simlating remote fetch");

            const accounts = [{
                id: 234,
                number: "72321123",
                displayName: "Online Savings",
                type: "savings",
                balance: 10000
            }, {
                id: 290,
                number: "345345211",
                displayName: "Business Checking",
                type: "checking",
                balance: 2303.23
            }, {
                id: 235,
                number: "349349494",
                displayName: "Interest Checking",
                type: "checking",
                balance: 2400
            }, {
                id: 240,
                number: "223989224",
                displayName: "Money Market",
                type: "moneymarket",
                balance: 3500
            }, {
                id: 988,
                number: "2039282104",
                displayName: "High Yield Certificate",
                type: "certificate",
                balance: 4050.30
            }]

            return Promise.resolve({
                accounts: accounts
            });
        },

        local(state, authToken) {
            return state.accounts;
        },

        success: BankActions.getAccountsCompleted,
        error: BankActions.getAccountsErrored,

    }

}
