import React from "react";

import "./AdminUsers.scss";
import AdminActions from "../../actions/AdminActions";
import AdminStore from "../../stores/AdminStore";
import Accounting from "../../lib/accounting";

import { Link } from "react-router-dom";

export const UserRow = ({user}) => {
    return (
        <tr>
            <td className="__link"><Link to={`/admin/users/${encodeURIComponent(user['username'])}`}>{user["username"]}</Link></td>
            <td>{user["2fa"]}</td>
            <td>{user["lastLoginAttempt"] ? new Date(user["lastLoginAttempt"]["date"]["$date"]).toLocaleString() : <i>Never</i>}</td>
            <td>{Accounting.formatMoney(user["accountBalance"])}</td>
        </tr>
    )
}

export const UsersList = ({usersList}) => {
    if (usersList === null) {
        return <p>Loading Users...</p>
    }

    return (
        <table className="UsersList">
            <thead>
                <tr>
                    <th>Username</th>
                    <th>2FA</th>
                    <th>Last Login Attempt</th>
                    <th>Account Balance</th>
                </tr>
            </thead>
            <tbody>
                { usersList.map(user => <UserRow key={user["username"]} user={user} />) }
            </tbody>
        </table>
    )
}


export default class AdminUsers extends React.Component {

    constructor() {
        super();

        this.state = {
            usersList: null,
        }
    }

    handleAdminStoreUpdated = (storeState) => {
        this.setState({
            usersList: AdminStore.getUsersListSummary(),
        })
    }

    componentDidMount() {
        AdminStore.listen(this.handleAdminStoreUpdated);
        AdminActions.getUsersList();
    }

    componentWillUnmount() {
        AdminStore.unlisten(this.handleAdminStoreUpdated);
    }



    render() {
        return (
            <div className="AdminUsers ">
                <h1>Users</h1>
                <UsersList usersList={this.state.usersList} />
            </div>
        )
    }

}
