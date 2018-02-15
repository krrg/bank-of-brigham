import React from "react";
import PropTypes from "prop-types";
import { Button } from "react-foundation";
import LoginActions from "../../../actions/LoginActions";
import LoginStore from "../../../stores/LoginStore";
import LoadingSpinner from "../../LoadingSpinner";
import ErrorWrapper from "../../ErrorWrapper";


export default class SmsVerifyBox extends React.Component {

    static propTypes = {
        digits: PropTypes.string,
    }

    constructor() {
        super();

        this.state = {
            resendLinkVisible: false,
            isError: false,
            errorMessage: "",
        }
    }

    handleLoginStoreUpdated = (storeState) => {
        this.setState({
            isError: !! storeState["errorMessage"],
            errorMessage: storeState["errorMessage"],
        });
    }

    componentDidMount() {
        LoginStore.listen(this.handleLoginStoreUpdated);

        console.log("The component did mount.");

        this.timeoutCancel = setTimeout(() => {
            console.log("Rerender already!");
            this.setState({
                resendLinkVisible: true
            })
        }, 15000);
    }

    componentWillUnmount() {
        if (this.timeoutCancel) {
            clearTimeout(this.timeoutCancel);
        }
        LoginStore.unlisten(this.handleLoginStoreUpdated);
    }

    handleVerificationCodeSubmit = (e) => {
        if (e) { e.preventDefault() }
        LoginActions.loginSms(this.refs.code.value);

    }

    handleResendVerificationCode = (e) => {
        if (e) { e.preventDefault() }
        LoginActions.beginSms()
        this.setState({
            resendLinkVisible: false
        })
        setTimeout(() => {
            this.setState({
                resendLinkVisible: true
            })
        }, 7500);
    }

    renderResendVerificationCode = () => {
        return (
            <p>
                Still haven't received your code? <a href onClick={this.handleResendVerificationCode}>Resend</a> the code.
            </p>
        )
    }

    render() {
        if (! this.props.digits) {
            return (
                <span>
                    Sending verification text message...
                    <LoadingSpinner />
                </span>
            )
        }

        return (
            <div className="SmsVerifyBox">
                <h2>Enter code</h2>
                <p>We've sent a verification code to (***) ***-**{this.props.digits}</p>
                <form onSubmit={this.handleVerificationCodeSubmit}>
                    <ErrorWrapper isErrored={this.state.isError} message={this.state.errorMessage ? this.state.errorMessage : ""}>
                    <input type="text" placeholder="Code" ref="code"/>
                    <Button>Submit</Button>
                    </ErrorWrapper>
                    { this.state.resendLinkVisible ? this.renderResendVerificationCode() : undefined }
                </form>
            </div>
        )
    }

}
