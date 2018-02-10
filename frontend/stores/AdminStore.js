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
        this.setState({
            eventsPasswordLogin: null,
        })
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
        const usersList = result.data["users"].map(user => {
            /* These transformations are a little fragile and must be done
               exactly in this order.  TODO: Make these transforms not interdependent. */
               user["events"] = sortEventsDescending(user["events"]);
               user = _.merge(user, summarizeUser(user));
               user["bank"] = user["bank"].map(transmogrifyBankObject)
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

    static getUserDailyLoginSummary(username) {
        const user = this.getUserByUsername(username);
        if (! user) {
            return null;
        }

        const firstLoginAttempt = getFirstLoginAttemptFromUser(user);
        if (! firstLoginAttempt) {
            return null;
        }

        const events_2fa = filter2faLoginSuccesses(user["events"]);
        const events_password = filterPasswordLoginSuccesses(user["events"]);

        const bucketedEvents = [events_2fa, events_password].map(events => {
            const bucketsMap = groupEventsInDayBuckets(events)
            return extractBucketList(bucketsMap, firstLoginAttempt["date"]["$date"], 14);
        })

        return {
            "2fa": bucketedEvents[0],
            "password": bucketedEvents[1],
        }
    }

    static getUserDailyLoginTimings(username) {
        const user = this.getUserByUsername(username);
        if (! user) {
            return null;
        }
        const firstLoginAttempt = getFirstLoginAttemptFromUser(user);
        if (! firstLoginAttempt) {
            return null;
        }
        const firstLogin = firstLoginAttempt["date"]["$date"];

        const events = user["events"];
        const events_password_start = filterPasswordLoginBeginAttempts(events);
        const events_password_end = filterPasswordLoginSuccesses(events);
        const events_2fa_start = filter2faLoginBeginAttempts(events);
        const events_2fa_end = filter2faLoginSuccesses(events);

        const timeDeltasPassword = computeEventTimeDeltasByToken(events_password_start, events_password_end);
        const timeDeltas2fa = computeEventTimeDeltasByProximity(events_2fa_start, events_2fa_end);

        return {
            "2fa": extractBucketList(timeDeltas2fa, firstLogin, 14),
            "password": extractBucketList(timeDeltasPassword, firstLogin, 14),
        }
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
    const lastLoginAttempt = getLastLoginAttemptFromUser(user);
    const accountBalance = totalAccountBalances(user["bank"]);

    return {
        "username": user["username"],
        "2fa": user["2fa"],
        "lastLoginAttempt": lastLoginAttempt,
        "accountBalance": accountBalance,
    }
}

const getLastLoginAttemptFromUser = (user /* this is the object, not the username */) => {
    const username = user["username"];
    const events = user["events"];

    return filterPasswordLoginBeginAttempts(events, username)[0];
}

const getFirstLoginAttemptFromUser = (user /* this is the object, not the username */) => {
    const username = user["username"];
    const events = user["events"];

    const loginBeginAttempts = filterPasswordLoginBeginAttempts(events, username);
    return loginBeginAttempts[loginBeginAttempts.length - 1]; // The first shall be last :)
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
        if (username) {
            return event["type"] === "begin_password" && event["username"] === username;
        } else {
            return event["type"] === "begin_password";
        }
    })
}

const filter2faLoginSuccesses = (events) => {
    return events.filter(event => {
        return event["type"] === "complete_2fa";
    });
}

const filter2faLoginBeginAttempts = (events) => {
    return events.filter(event => {
        return event["type"] === "begin_2fa"
    })
}

const sortEventsDescending = (events) => {
    return _.sortBy(events, event => {
        return -1 * event["date"]["$date"];
    })
}

const sortEventsAscending = (events) => {
    return _.sortBy(events, event => {
        return event["date"]["$date"];
    })
}

const truncateDate = (date) => {
    const truncated = new Date(date);
    truncated.setHours(0);
    truncated.setMinutes(0);
    truncated.setSeconds(0);
    truncated.setMilliseconds(0);
    return truncated;
}

const groupEventsInDayBuckets = (events) => {
    const buckets = {};
    events.forEach(event => {
        const key = truncateDate(event["date"]["$date"]);
        if (! buckets[key]) {
            buckets[key] = [];
        }
        buckets[key].push(event);
    })
    return buckets;
}

/* Could not resist this name */
const extractBucketList = (bucketsMap, startDate, numberBuckets) => {
    const truncatedStartDate = truncateDate(startDate);
    const buckets = [];

    _.range(0, numberBuckets).map(dayOffset => {
        const potentialKey = new Date(truncatedStartDate);
        potentialKey.setDate(potentialKey.getDate() + dayOffset);

        if (potentialKey in bucketsMap) {
            buckets.push(bucketsMap[potentialKey]);
        } else {
            buckets.push([]);
        }
    })

    return buckets;
}

const hashEventsByToken = (events) => {
    return _.keyBy(events, event => event["token"]);
}

const computeEventTimeDeltasByToken = (eventGroupStart, eventGroupEnd) => {
    const timeDeltasMap = {};

    const startEvents = hashEventsByToken(eventGroupStart);
    const endEvents = hashEventsByToken(eventGroupEnd);

    for (const token in startEvents) {
        if (token in endEvents) {
            const startDate = startEvents[token]["date"]["$date"];
            const endDate = endEvents[token]["date"]["$date"];
            const delta = endDate - startDate;
            const truncatedStart = truncateDate(startDate);

            if (! timeDeltasMap[truncatedStart]) {
                timeDeltasMap[truncatedStart] = [];
            }
            timeDeltasMap[truncatedStart].push(delta);
        }
    }

    console.log("here is the time detlas map", timeDeltasMap);

    return timeDeltasMap;
}

const computeEventTimeDeltasByProximity = (eventGroupsStart, eventGroupEnd) => {
    /* This would be easier with a binary tree, but for amount of data we will have,
       we'll suffer some minor inefficiency */
    const timeDeltasMap = {};

    const sortedStart = sortEventsAscending(eventGroupsStart);
    const sortedEnd = sortEventsAscending(eventGroupEnd);

    sortedStart.forEach(startEvent => {
        const endEvent = _.find(sortedEnd, endEvent =>
            endEvent["date"]["$date"] > startEvent["date"]["$date"]
        )
        const startDate = startEvent["date"]["$date"];
        const endDate = endEvent["date"]["$date"];
        const delta = endDate - startDate;
        const truncatedStart = truncateDate(startDate);

        if (! timeDeltasMap[truncatedStart]) {
            timeDeltasMap[truncatedStart] = [];
        }
        timeDeltasMap[truncatedStart].push(delta);
    });

    return timeDeltasMap;
}


const AltAdminStoreStore = AltInstance.createStore(AdminStore, 'AdminStore');
export default AltAdminStoreStore;
