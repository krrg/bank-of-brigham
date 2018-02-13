import React from "react";
import { withRouter, Link } from "react-router-dom";

import "./TwoFactorSelection.scss";

class TwoFactorSelection extends React.Component {

    TwoFactorButton = ({displayText, shortName, to}) => {
        return (
            <div className="TwoFactorButton">
                <Link className="__groupNumber" to={to}>{ displayText }</Link>
                <div className="__shortName">{ shortName }</div>
            </div>
        )
    }

    renderTwoFactorSelectorList = () => {

        const groups = [
            {
                displayText: "1",
                shortName: "SMS",
                key: "sms"
            }, {
                displayText: "2",
                shortName: "TOTP",
                key: "totp",
            }, {
                displayText: "3",
                shortName: "Backup",
                key: "codes",
            }, {
                displayText: "4",
                shortName: "U2F",
                key: "u2f",
            }, {
                displayText: "5",
                shortName: "Push",
                key: "push"
            }, {
                displayText: "6",
                shortName: "Control",
                key: "passwords"
            }
        ]

        return (
            <div className="__content">
                <h2>Study Group Selection</h2>
                <p>Please ask the study coordinator which group you are part of before proceeding:</p>
                <div className="TwoFactorSelectorList">
                    { groups.map(group => {
                        return (
                            <this.TwoFactorButton
                                displayText={group["displayText"]}
                                shortName={group["shortName"]}
                                key={`k${group["key"]}`}
                                to={`/create/3/${group["key"]}`}
                            />
                        )
                    })}
                </div>
            </div>
        )
    }

    render() {
        return (
            <div className="TwoFactorSelection">
                { this.renderTwoFactorSelectorList() }
            </div>
        )
    }

}

export default withRouter(TwoFactorSelection);
