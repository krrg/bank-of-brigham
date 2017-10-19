import React from "react";
import PropTypes from "prop-types";
import FancyPieChart from "./FancyPieChart";

import "./AccountOverview.scss";

class AccountOverview extends React.Component {

    renderSingleAccount = (accountObj) => {
        return (
            <div className="AccountRow" key={accountObj["id"]}>
                { accountObj["displayName"] }
                { accountObj["type"] }
                { accountObj["balance"] }
            </div>
        )
    }

    render() {
        return (
            <div className="AccountOverview">
                <h2>Account Overview</h2>

                <FancyPieChart accounts={this.props.accounts} />

                {(this.props.accounts || []).map(account =>
                    this.renderSingleAccount(account)
                )}
            </div>
        )
    }

}

AccountOverview.propTypes = {
    accounts: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.any.isRequired,
        displayName: PropTypes.string.isRequired,
        type: PropTypes.oneOf(["checking", "savings", "certificate", "moneymarket"]),
        balance: PropTypes.number.isRequired
    }))
}

export default AccountOverview;

