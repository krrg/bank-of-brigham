import React from "react";
import LoadingSpinner from "../../LoadingSpinner";
import LoginActions from "../../../actions/LoginActions";
import LoginStore from "../../../stores/LoginStore";


class U2FVerifyBox extends React.Component {

    constructor() {
        super();

        this.state = {
            u2fVerified: false,
        }
    }

    handleLoginStoreUpdated = (storeState) => {
        this.setState({
            u2fVerified: storeState["u2fVerified"],
        });
    }

    componentDidMount() {
        LoginStore.listen(this.handleLoginStoreUpdated);
        LoginActions.loginU2F();
    }

    componentWillUnmount() {
        LoginStore.unlisten(this.handleLoginStoreUpdated);
    }

    render() {
        return (
            <div className="U2FVerifyBox">
                <h2>Verify with Security Key</h2>
                <p>Insert your Security Key into your computer's USB port and tap the button.</p>
                { this.state.u2fVerified ? null : <LoadingSpinner />}
            </div>
        )
    }

}

withRouter(U2FVerifyBox);
