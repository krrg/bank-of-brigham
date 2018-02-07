import React from "react";
import { Button } from "react-foundation";
import AdminStore from "../../stores/AdminStore";
import AdminActions from "../../actions/AdminActions";

import "./AdminStatus.scss";

export default class AdminStatus extends React.Component {

    constructor() {
        super();

        this.state = {
            loginStatsPasswords: AdminStore.getPasswordLoginStats(),
            loginStats2fa: null,
        }
    }

    handleAdminStoreUpdated = (storeState) => {
        this.setState({
            loginStatsPasswords: AdminStore.getPasswordLoginStats(),
        })
    }

    componentDidMount = () => {
        AdminStore.listen(this.handleAdminStoreUpdated)

        AdminActions.getPasswordLoginEvents();
        // AdminActions.get2faLoginEvents();
    }

    componentWillUnmount = () => {
        AdminStore.unlisten(this.handleAdminStoreUpdated);
    }

    renderQuickStats = () => {
        const loginStatsPasswords = this.state.loginStatsPasswords;

        if (loginStatsPasswords === null) {
            return;
        }

        return (
            <table>
                <tbody>
                    <tr><td>Success:</td><td>{ loginStatsPasswords["success"] }</td></tr>
                    <tr><td>Failed:</td><td>{ loginStatsPasswords["failed"] }</td></tr>
                    <tr><td>Orphaned:</td><td>{ loginStatsPasswords["orphaned"] }</td></tr>
                </tbody>
            </table>
        )
    }

    render() {
        return (
            <div className="AdminStatus">
                <h2>Overview</h2>

                { this.renderQuickStats() }
            </div>
        )
    }

}
