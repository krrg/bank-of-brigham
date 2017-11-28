import React from "react";
import SignupStore from "../../../stores/SignupStore";
import SignupActions from "../../../actions/SignupActions";


import "./CodesSignup.scss";

export default class CodesSignup extends React.Component {

    constructor() {
        super();

        this.state = {
            backupCodes: null,
        }
    }

    handleSignupStoreUpdated = (storeState) => {
        this.setState({
            backupCodes: storeState["backupCodes"]
        })
    }

    componentDidMount() {
        SignupStore.listen(this.handleSignupStoreUpdated);
        SignupActions.postSignupBackupCodes();
    }

    componentWillUnmount() {
        SignupStore.unlisten(this.handleSignupStoreUpdated);
    }

    render() {
        return (
            <div className="CodesSignup">
                <div className="__content">
                    <h1>Verification Codes</h1>
                </div>
            </div>
        )
    }
}
