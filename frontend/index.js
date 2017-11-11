import React from "react";
import ReactDOM from "react-dom";
import * as F from "react-foundation";
import { BrowserRouter, Route, Redirect, IndexRoute } from "react-router-dom";

import Login from "./components/Login/Login";
import SignupUsernamePassword from "./components/Signup/SignupUsernamePassword";
import TwoFactorSelection from "./components/Signup/TwoFactorSelection";
import Bank from "./components/Bank/Bank";
import HeaderBar from "./components/Bank/HeaderBar/HeaderBar";
import Transfers from "./components/Bank/Transfers/Transfers";

import "./index.scss";

const Index = () => {
    return (
        <BrowserRouter>
            <div>
                <Route exact path="/" component={() => <Redirect to="/login" />} />
                <Route exact path="/login" component={() => <Login />} />
                <div>
                    <Route exact path="/create" component={() => <Redirect to="/create/1"/>} />
                    <Route exact path="/create/1" component={() => <SignupUsernamePassword /> } />
                    <Route exact path="/create/2" component={() => <TwoFactorSelection />} />
                </div>
                <div>
                    <Route path="/bank" component={() => <HeaderBar />} />
                    <Route exact path="/bank" component={() => <Bank />} />
                    <Route exact path="/bank/transfers" component={() => <Transfers />} />
                    <Route exact path="/bank/payments" component={() => <Payments />} />
                    <Route exact path="/bank/settings" component={() => null} />
                </div>
            </div>
        </BrowserRouter>
    )
}


const reactEntry = document.createElement("div");
ReactDOM.render(<Index />, reactEntry);
document.body.appendChild(reactEntry)
