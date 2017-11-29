import React from "react";
import { Button } from "react-foundation";
import { withRouter } from "react-router-dom";
import SignupStore from "../../../stores/SignupStore";
import SignupActions from "../../../actions/SignupActions";
import LoadingSpinner from "../../LoadingSpinner";
import QRCode from "qrcode.react";


import "./TotpSignup.scss";

class TotpSignup extends React.Component {

    constructor() {
        super();

        this.state = {
            totpProvisioningUri: null,
            totpSecret: null,
            appDownloaded: false,
            qrCodeScanned: false,
        }
    }

    handleSignupStoreUpdated = (storeState) => {
        this.setState({
            totpProvisioningUri: storeState["totpProvisioningUri"],
            totpSecret: storeState["totpSecret"],
        })
    }

    componentDidMount() {
        SignupStore.listen(this.handleSignupStoreUpdated);
    }

    componentWillUnmount() {
        SignupStore.unlisten(this.handleSignupStoreUpdated);
    }

    handleNextButtonDownloadedClicked = (e) => {
        if (e) { e.preventDefault(); }
        SignupActions.signupTotp();

        this.setState({
            appDownloaded: true,
        })
    }

    renderPlayLink = () => {
        return (
            <a className="__googlePlayLink" href='https://play.google.com/store/apps/details?id=org.fedorahosted.freeotp&pcampaignid=MKT-Other-global-all-co-prtnr-py-PartBadge-Mar2515-1'>
                <img alt='Get it on Google Play' src='https://play.google.com/intl/en_us/badges/images/generic/en_badge_web_generic.png'/>
            </a>
        )
    }

    renderStep1_DownloadApp = () => {
        return (
            <div className="Step">
                <h3>Step 1</h3>
                <p>Download the <b>FreeOTP Authenticator</b> app to your Android device</p>
                { this.renderPlayLink() }
                { this.state.appDownloaded ? null :
                     <Button className="nextButtonDownloaded" onClick={this.handleNextButtonDownloadedClicked}>Next</Button>
                }
            </div>
        )
    }

    renderQrCode = () => {
        return (
            <div className="QrCodeContainer">
                <div>
                    <QRCode value={this.state.totpProvisioningUri} size={256}/>
                    <p className="__secret">{ this.state.totpSecret }</p>
                </div>
            </div>
        )
    }

    renderStep2_ScanQrCode = () => {
        return (
            <div className="Step">
                <h3>Step 2</h3>
                <p>Use the <b>FreeOTP Authenticator</b> app on your Android device to scan this QR code:</p>
                { this.state.totpProvisioningUri ? this.renderQrCode() : <LoadingSpinner /> }
            </div>
        )
    }

    renderStep3_VerifyWorkingWithCode = () => {
        return (
            <div>

            </div>
        )
    }

    render() {
        return (
            <div className="TotpSignup">
                <h2>Authenticator App</h2>
                { this.renderStep1_DownloadApp() }
                { this.state.appDownloaded ? this.renderStep2_ScanQrCode() : null }
                { this.state.qrCodeScanned ? this.renderStep3_VerifyWorkingWithCode() : null }
            </div>
        )
    }
}

export default withRouter(TotpSignup);
