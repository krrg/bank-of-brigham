import React from "react";
import BankStore from "../../../stores/BankStore";

import "./Transfers.scss";


export default class Payments extends React.Component {

    constructor() {
        super();

        this.state = {
            accounts: BankStore.getState().accounts,
            from: null,
            amount: null,

        }
    }

    render() {
        return (
            <div>

            </div>
        )
    }

}

