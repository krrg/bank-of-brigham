import React from "react";
import ReactDOM from "react-dom";
import * as F from "react-foundation";
import { BrowserRouter, Route, Redirect, IndexRoute } from "react-router-dom";

import Login from "./components/Login/Login";
import Signup from "./components/Signup/Signup";
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
                <Route exact path="/create" component={() => <Signup />} />
                <Route exact path="/bank">
                    <div>
                        <Route path="/bank" component={() => <HeaderBar />} />
                        <Route exact path="/bank" component={() => <Bank />} />
                        <Route exact path="/bank/transfers" component={() => <Transfers />} />
                        <Route exact path="/bank/payments" component={() => <Payments />} />
                        <Route exact path="/bank/settings" component={() => null} />
                    </div>
                </Route>
            </div>
        </BrowserRouter>
    )
}


const reactEntry = document.createElement("div");
ReactDOM.render(<Index />, reactEntry);
document.body.appendChild(reactEntry)
