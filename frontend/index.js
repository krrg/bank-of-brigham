import React from "react";
import ReactDOM from "react-dom";
import * as F from "react-foundation";
import { BrowserRouter, Route, Redirect, IndexRoute } from "react-router-dom";

import Login from "./components/Login/Login";
import Bank from "./components/Bank/Bank";
import HeaderBar from "./components/Bank/HeaderBar/HeaderBar";
import Transfers from "./components/Bank/Transfers/Transfers";

import "./index.scss";

const Index = () => {
    return (
        <BrowserRouter>
            <div>
                <Route path="/" exact component={() => <Redirect to="/login" />} />
                <Route path="/login" component={() => <Login />} />
                <Route exact path="/bank">
                    <div>
                        <HeaderBar />
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
