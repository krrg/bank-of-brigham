import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Redirect, IndexRoute } from "react-router-dom";

import Bank from "./components/Bank/Bank";
import HeaderBar from "./components/Bank/HeaderBar/HeaderBar";
import Transfers from "./components/Bank/Transfers/Transfers";
import Payments from "./components/Bank/Transfers/Payments";

import LoginRouterWrapper from "./components/Login/LoginRouterWrapper";
import Logout from "./components/Login/Logout";
import SignupUsernamePassword from "./components/Signup/SignupUsernamePassword";
import TwoFactorSelection from "./components/Signup/TwoFactorSelection";
import SmsSignup from "./components/Signup/2fa/SmsSignup";
import SmsSignupVerify from "./components/Signup/2fa/SmsSignupVerify";
import CodesSignup from "./components/Signup/2fa/CodesSignup";
import TotpSignup from "./components/Signup/2fa/TotpSignup";
import U2FSignup from "./components/Signup/2fa/U2FSignup";
import PushSignup from "./components/Signup/2fa/PushSignup";

import Admin from "./components/Admin"

import babelPolyfill from "babel-polyfill";
import "./index.scss";

const Index = () => {
    return (
        <BrowserRouter>
            <div>
                <Route exact path="/" component={() => <Redirect to="/login" />} />
                <div>
                    <Route path="/login" component={() => <HeaderBar showLinks={false} link="/create" />} />
                    <Route exact path="/login" component={() => <Redirect to="/login/1" />} />
                    <Route path="/login/:stage" component={() => <LoginRouterWrapper />} />
                </div>
                <Route exact path="/logout" component={() => <div><HeaderBar showLinks={false} link="/login" /><Logout /></div>} />
                <div>
                    <Route path="/create" component={() => <HeaderBar showLinks={false} link="/login" />} />
                    <Route exact path="/create" component={() => <Redirect to="/create/1"/>} />
                    <Route exact path="/create/1" component={() => <SignupUsernamePassword />} />
                    <Route exact path="/create/2" component={() => <TwoFactorSelection />} />
                    <Route exact path="/create/3/sms" component={() => <SmsSignup />} />
                    <Route exact path="/create/4/sms" component={() => <SmsSignupVerify />} />
                    <Route exact path="/create/3/codes" component={() => <CodesSignup />} />
                    <Route exact path="/create/3/totp" component={() => <TotpSignup />} />
                    <Route exact path="/create/3/u2f" component={() => <U2FSignup />} />
                    <Route exact path="/create/3/push" component={() => <PushSignup />} />
                </div>
                <div>
                    <Route path="/bank" component={() => <HeaderBar showLinks={true} link="/bank" />} />
                    <Route exact path="/bank" component={() => <Bank />} />
                    <Route exact path="/bank/transfers" component={() => <Transfers />} />
                    <Route exact path="/bank/payments" component={() => <Payments />} />
                    <Route exact path="/bank/settings" component={() => null} />
                </div>
                <div>
                    <Route path="/admin" component={() => <Admin.Header />} />
                    <Route exact path="/admin" component={() => <Admin.Status />} />
                    <Route exact path="/admin/timings" component={() => <Admin.Timings />} />
                    <Route exact path="/admin/users" component={() => <Admin.Users /> }/>
                </div>
            </div>
        </BrowserRouter>
    )
}


const reactEntry = document.createElement("div");
ReactDOM.render(<Index />, reactEntry);
document.body.appendChild(reactEntry)
