import React from "react";
import { withRouter } from "react-router-dom";
import * as F from "react-foundation";

import "./TwoFactorSelection.scss";

class TwoFactorSelection extends React.Component {

    TwoFactorButton = ({displayText, onClick}) => {
        return (
            <F.Button className="TwoFactorButton" onClick={onClick}>
                { displayText }
            </F.Button>
        )
    }

    renderTwoFactorSelectorList = () => {

        const groups = {
            "SMS": "sms",
            "TOTP": "totp",
            "U2F": "u2f",
            "Push": "push",
            "Codes": "codes",
        }

        return (
            <div className="__content">
                <h2>Study Group Selection</h2>
                <p>Please select your assigned study group (ask study coordinator if unsure):</p>
                <div className="TwoFactorSelectorList">
                    { _.keys(groups).map(displayText => {
                        const key = groups[displayText]

                        const handleGroupSelectionClick = (e) => {
                            if (e) { e.preventDefault(); }

                            this.props.history.push(`/create/3/${key}`)
                        }

                        return (
                            <this.TwoFactorButton
                                displayText={displayText}
                                key={`k${key}`}
                                onClick={handleGroupSelectionClick}
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
