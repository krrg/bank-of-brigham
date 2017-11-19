import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import SmsVerifyBox from "./2fa/SmsVerifyBox";
import LoginStore from "../../stores/LoginStore";

import "./Login.scss";

class Login2FA extends React.Component {

    static propTypes = {
        secondFactor: PropTypes.oneOf(["sms", "totp", "push", "codes", "u2f"]).isRequired,
    }

    constructor() {
        super();
        this.state = {
            phoneNumber: null,
        }
    }

    handleLoginStoreUpdated = (storeState) => {
        this.setState({
            phoneNumber: storeState["phoneNumber"],
        })
    }

    componentDidMount() {
        LoginStore.listen(this.handleLoginStoreUpdated);
    }

    componentWillUnmount() {
        LoginStore.unlisten(this.handleLoginStoreUpdated);
    }

    render2FA = () => {
        switch (this.props.secondFactor) {
            case "sms": return <SmsVerifyBox digits={this.state.phoneNumber}/>;
            default: return <p>This 2FA method ({this.props.secondFactor}) not ready yet.</p>
        }
    }

    render() {
        return (
            <div className="LoginBox">
                { this.render2FA() }
            </div>
        )
    }

}

export default withRouter(Login2FA);
