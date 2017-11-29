import React from "react";
import SignupStore from "../../../stores/SignupStore";
import SignupActions from "../../../actions/SignupActions";
import LoadingSpinner from "../../LoadingSpinner";
import {Button} from "react-foundation";
import {withRouter} from "react-router-dom";


import "./CodesSignup.scss";

class CodesSignup extends React.Component {

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
        SignupActions.signupBackupCodes();
    }

    componentWillUnmount() {
        SignupStore.unlisten(this.handleSignupStoreUpdated);
    }

    renderCodesList = () => {
        console.log("Codes list", this.state.backupCodes);

        return (
            <div className="__centerContainer">
                <ul className="CodesList">
                    { this.state.backupCodes.map((code) => {
                        return (<li key={"code-"+code} className="__row">{String.fromCodePoint(9633)} {code}</li>)
                    })}
                </ul>
            </div>
        )
    }

    handleNextButton = (e) => {
        if (e) { e.preventDefault() }
        this.props.history.push("/bank");
    }

    render() {
        return (
            <div className="CodesSignup">
                <div className="__content">
                    <h1>Verification Codes</h1>
                    <p className="__textKeepSafe">
                        Print these codes out and keep them safe but accessible.  Check each code off as you use it.
                    </p>
                    { this.state.backupCodes ? this.renderCodesList() : <LoadingSpinner /> }
                    <Button className="btnNext" onClick={this.handleNextButton}>Next</Button>
                </div>
            </div>
        )
    }
}

export default withRouter(CodesSignup)
