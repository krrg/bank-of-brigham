import React from "react";
import LoadingSpinner from "../../LoadingSpinner";
import LoginActions from "../../../actions/LoginActions";
import LoginStore from "../../../stores/LoginStore";
import  { withRouter } from "react-router-dom";

class PushVerifyBox extends React.Component {

    constructor() {
        super();

        this.state = {
            authyVerified: false,
        }
    }

    handleLoginStoreUpdated = (storeState) => {
        this.setState({
            authyVerified: storeState["authenticationLevel"] === "full",
        });

        if (this.state.authyVerified) {
            this.props.history.push("/bank");
        }
    }

    componentDidMount() {
        LoginStore.listen(this.handleLoginStoreUpdated);
        setTimeout(() => {
            LoginActions.loginPush()
        }, 0);
    }

    componentWillUnmount() {
        LoginStore.unlisten(this.handleLoginStoreUpdated);
    }

    render() {
        return (
            <div className="PushVerifyBox">
                <h2>Verification Step</h2>
                <LoadingSpinner />
                <p style={{textAlign: "center"}}>Use the Authy app on your phone to approve this login request.</p>
            </div>
        )
    }

}

export default withRouter(PushVerifyBox);
