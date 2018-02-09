import React from "react";

import "./AdminSpecificUser.scss";
import AdminActions from "../../actions/AdminActions";
import AdminStore from "../../stores/AdminStore";
import { UsersList } from "./AdminUsers";
import { Button } from "react-foundation";
import DetailsList from "../Bank/DetailsList/DetailsList";
import _ from "lodash";

export class EventList extends React.Component {

    renderKeyValue = (key, dictionary, formatter) => {
        const value = _.get(dictionary, key);
        return (
            <tr key={key}>
                <td className="__colKey">{key}</td>
                <td className="__colValue">
                    <code>{formatter && typeof(formatter) === "function" ? formatter(value) : value }</code>
                </td>
            </tr>
        )
    }

    renderRow = (event) => {
        return (
            <table>
                <tbody>
                    { this.renderKeyValue(["_id", "$oid"], event)}
                    { this.renderKeyValue(["date", "$date"], event, (d) => new Date(d).toLocaleString())}
                    { this.renderKeyValue("username", event)}
                    { this.renderKeyValue("type", event)}
                    { this.renderKeyValue("token", event, (v) => new String(v))}
                    { this.renderKeyValue("success", event, (v) => new String(v))}
                </tbody>
            </table>
        )
    }

    render() {
        if (! this.props.events) {
            return <p>Loading event...</p>;
        }
        return (
            <div className="EventList">
                <h3>Events</h3>

                {this.props.events.map(event => {
                    return (
                        <div key={event["_id"]["$oid"]}>
                            <hr/>
                            { this.renderRow(event) }
                        </div>
                    )
                })}
            </div>
        )
    }

}

const NumberRow = ({numbers, label, isHeaderRow}) => {
    if (isHeaderRow) {
        return (
            <tr>
                <th>{ label }</th>
                { numbers.map((number, i) =>
                    <th key={`bucket-${i}`} className="__bucket">
                        { number }
                    </th>
                )}
            </tr>
        )
    } else {
        return (
            <tr>
                <td>{ label }</td>
                { numbers.map((number, i) =>
                    <td key={`bucket-${i}`} className="__bucket">
                        { number }
                    </td>
                )}
            </tr>
        )
    }
}

const DailyLoginChart = ({buckets}) => {

    return (
        <div className="DailyLoginChart">
            <table>
                <thead>
                    <NumberRow isHeaderRow={true} label="Day" numbers={_.range(1, buckets["2fa"].length + 1)} />
                </thead>
                <tbody>
                    <NumberRow isHeaderRow={false} label="2fa Success" numbers={buckets["2fa"].map(b => b.length)} />
                    <NumberRow isHeaderRow={false} label="PW Success" numbers={buckets["password"].map(b => b.length)} />
                </tbody>
            </table>
        </div>
    )
}


export default class AdminSpecificUser extends React.Component {

    constructor() {
        super();

        this.state = {
            user: null,
        }
    }

    getUsername = () => {
        return this.props.username;
    }

    handleAdminStoreUpdated = (storeState) => {
        this.setState({
            user: AdminStore.getUserByUsername(this.getUsername()),
            userDailyLoginSummary: AdminStore.getUserDailyLoginSummary(this.getUsername()),
        })

        console.log(this.state.userDailyLoginSummary);
    }

    componentDidMount() {
        AdminStore.listen(this.handleAdminStoreUpdated);
        AdminActions.getUsersList();
    }

    componentWillUnmount() {
        AdminStore.unlisten(this.handleAdminStoreUpdated);
    }

    renderAccounts = (accounts) => {
        return (
            <DetailsList accounts={accounts} alternateTitle="Balance Details"/>
        )
    }

    renderUser = () => {
        return (
            <div>
                <h1>User Details</h1>
                <UsersList usersList={[this.state.user]} />



            </div>
        )
    }

    render() {
        if (this.state.user === null) {
            return <p>Loading...</p>
        } else if (this.state.user === undefined) {
            return <p>Could not find user <b>{ this.getUsername() }</b></p>
        }

        return (
            <div className="container">
                <div className="AdminSpecificUser">
                    { this.renderUser() }
                </div>
                { this.renderAccounts(this.state.user["bank"]) }
                <div className="content-container">
                    <DailyLoginChart buckets={this.state.userDailyLoginSummary} />
                    <EventList events={this.state.user["events"]}/>
                </div>

            </div>
        )
    }

}
