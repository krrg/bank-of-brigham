import AltInstance from "../alt";
import AdminApi from "../api/AdminApi";
import AdminActions from "../actions/AdminActions";
import { transmogrifyBankAccount, transmogrifyBankObject } from "../api/BankApi";
import _ from "lodash";

class AdminStore {
    constructor() {
        this.state = {
            eventsPasswordLogin: null,
            events2faLogin: null,
            usersList: null,
            usersMap: null,
        }

        this.bindActions(AdminActions);
        this.registerAsync(AdminApi);
    }

    onGetPasswordLoginEvents() {
        if (! this.getInstance().isLoading()) {
            this.getInstance().getPasswordLoginEvents();
        }
    }

    onGetPasswordLoginEventsCompleted(result) {
        this.setState({
            eventsPasswordLogin: result.data["events"]
        })
    }

    onGetPasswordLoginEventsErrored(error) {
        console.error(error);
    }

    onGetUsersList() {
        if (! this.getInstance().isLoading()) {
            this.getInstance().getUsersList();
        }
    }

    onGetUsersListCompleted(result) {
        console.log("The users list is completed", result.data)

        const usersList = result.data["users"].map(user => {
            user = _.merge(user, summarizeUser(user));
            user["bank"] = user["bank"].map(transmogrifyBankObject)
            user["events"] = sortEventsDescending(user["events"]);
            return user;
        })

        const usersMap = _.keyBy(usersList, user => user['username']);

        this.setState({
            usersList: usersList,
            usersMap: usersMap,
        })
    }

    onGetUsersListErrored(errored) {

    }

    static getUserByUsername(username) {
        if (! this.getState().usersMap) {
            return null;
        }
        return this.getState().usersMap[username]
    }

    static getPasswordLoginSuccesses() {
        const eventsPasswordLogin = this.getState().eventsPasswordLogin;
        return filterPasswordLoginSuccesses(eventsPasswordLogin);
    }

    static getPasswordLoginFailed() {
        const eventsPasswordLogin = this.getState().eventsPasswordLogin;
        return filterPasswordLoginFailed(eventsPasswordLogin);
    }

    static getPasswordLoginOrphaned() {
        const eventsPasswordLogin = this.getState().eventsPasswordLogin;
        return filterPasswordLoginOrphaned(eventsPasswordLogin);
    }

    static getPasswordLoginStats() {
        const eventsPasswordLogin = this.getState().eventsPasswordLogin;
        if (eventsPasswordLogin === null) {
            return null;
        }

        return {
            success: this.getPasswordLoginSuccesses().length,
            failed: this.getPasswordLoginFailed().length,
            orphaned: this.getPasswordLoginOrphaned().length,
        }
    }

    static getUsersListSummary() {
        return this.getState().usersList; // All users now come pre-summarized
    }
}

export const summarizeUser = (user) => {
    const username = user["username"];
    const secondFactor = user["2fa"];
    const events = user["events"];
    const lastLoginAttempt = filterPasswordLoginBeginAttempts(events, username)[0];
    const accountBalance = totalAccountBalances(user["bank"]);

    return {
        "username": user["username"],
        "2fa": user["2fa"],
        "lastLoginAttempt": lastLoginAttempt,
        "accountBalance": accountBalance,
    }
}

const totalAccountBalances = (accounts) => {
    return _.sumBy(accounts, account => {
        return account["balance_cents"] / 100.0
    })
}

const filterPasswordLoginSuccesses = (events) => {
    return events.filter((event) => {
        return event["type"] === "complete_password" && event["success"] === true;
    })
}

const filterPasswordLoginFailed = (events) => {
    return events.filter((event) => {
        return event["type"] === "complete_password" && event["success"] === false;
    })
}

const filterPasswordLoginOrphaned = (events) => {
    return events.filter((event) => {
        return event["type"] === "begin_password" && event["username"] === undefined;
    })
}

const filterPasswordLoginBeginAttempts = (events, username) => {
    return events.filter(event => {
        return event["type"] === "begin_password" && event["username"] === username;
    })
}

const sortEventsDescending = (events) => {
    return _.sortBy(events, event => {
        console.log(-1 * event["date"]["$date"], "<<<< date");
        return -1 * event["date"]["$date"];
    })
}

const AltAdminStoreStore = AltInstance.createStore(AdminStore, 'AdminStore');
export default AltAdminStoreStore;
