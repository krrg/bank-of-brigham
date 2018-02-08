import BankActions from "../actions/BankActions";
import axios from "axios";
import { apihost as host } from "../constants";
import babelPolyfill from "babel-polyfill";


export const transmogrifyBankObject = (bankObject) => {
    if (! bankObject) {
        return bankObject;  // GIGO
    }

    return {
        "id": bankObject["_id"]["$oid"],
        "number": bankObject["number"].toString(),
        "displayName": bankObject["displayName"],
        "type": bankObject["type"],
        "balance": bankObject["balance_cents"] / 100.0,
    }
}


export const BankSource = {

    fetchAccounts: {

        async remote(state) {

            const result = await axios.get(`${host}/bank`);

            const accounts = result.data["accounts"];

            console.log("Accounts: ", accounts)
            return {
                accounts: accounts.map(transmogrifyBankObject)
            }

        },

        success: BankActions.getAccountsCompleted,
        error: BankActions.getAccountsErrored,

    }

}

/* It turns out that the POST-redirect pattern does not fit nicely into
    flux architecture (and I know I did this in the login pages too).
    For those of you that think there is a simple solution to this,
    you are probably wrong, there is never a simple answer.
    See huge discussion here on this very problem: https://github.com/reactjs/redux/issues/297

    In the name of getting this done for thesis, I am going with a promise-returning Api class.
    In production, would want to revisit this issue to better understand proper way to do this
    in flux.
*/

export class BankApi {

    static postTransfer = async (amountCents, from, to) => {
        console.log("From and to", amountCents, from, to);

        await axios.post(`${host}/bank/transfer`, {
            amountCents: amountCents,
            from: from,
            to: to
        });
    }

    static postPayment = async (amountCents, from) => {
        console.log("Posting payment from: ", amountCents, from);

        await axios.post(`${host}/bank/payment`, {
            amountCents: amountCents,
            from: from,
        })
    }

}

