import AltInstance from "../alt";
import AdminApi from "../api/AdminApi";
import AdminActions from "../actions/AdminActions";
import _ from "lodash";

class AdminStore {
    constructor() {
        this.state = {
            eventsPasswordLogin: null,
            events2faLogin: null,
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

    static getPasswordLoginSuccesses() {
        const eventsPasswordLogin = this.getState().eventsPasswordLogin;
        return eventsPasswordLogin.filter((event) => {
            return event["type"] === "complete_password" && event["success"] === true;
        })
    }

    static getPasswordLoginFailed() {
        const eventsPasswordLogin = this.getState().eventsPasswordLogin;
        return eventsPasswordLogin.filter((event) => {
            return event["type"] === "complete_password" && event["success"] === false;
        })
    }

    static getPasswordLoginOrphaned() {
        const eventsPasswordLogin = this.getState().eventsPasswordLogin;
        return eventsPasswordLogin.filter((event) => {
            return event["type"] === "begin_password" && event["username"] === undefined;
        })
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
}

const AltAdminStoreStore = AltInstance.createStore(AdminStore, 'AdminStore');
export default AltAdminStoreStore;
