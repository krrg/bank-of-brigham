import React from "react";
import Select from "react-select";
import Accounting from "../../../lib/accounting";
import { accountTypesMap } from "../../../constants";

import "./Transfers.scss";


const ColorBlock = ({color}) => {
    return (
        <span style={{
            backgroundColor: color,
        }} className="__colorBlock">
        </span>
    )
}


export default class TransferOption extends React.Component {

    onMouseMove = (e) => {
        if (this.props.isFocused) {
            return;
        }
        if (this.props.onFocus) {
            this.props.onFocus(this.props.option, e);
        }
    }

    onMouseEnter = (e) => {
        if (this.props.onFocus) {
            this.props.onFocus(this.props.option, e);
        }
    }

    onMouseDown = (e) => {
        if (e) { e.preventDefault(); }
        if (this.props.onSelect) {
            this.props.onSelect(this.props.option, e);
        }
    }

    render() {
        const account = this.props.option || this.props.value;

        if (! account) {
            return <option>null sandwich</option>
        }

        const color = accountTypesMap[account["type"]]["color"];
        const accountNumber = account["number"].toString();

        return (
            <div
                className="TransferOption"
                onMouseMove={this.onMouseMove}  /* onClick was broken by the author of React-Select, not sure of details why? Strange. */
                onMouseDown={this.onMouseDown}
                onMouseEnter={this.onMouseEnter}
            >
                <ColorBlock color={color} />
                <span className="__displayName">{account["displayName"]}</span>
                <span className="__accountNumber">
                    { accountNumber.substring(accountNumber.length - 4) }
                </span>
                <span className="__lineEnd">
                    <span className="__balance">
                        { Accounting.formatMoney(account["balance"]) }
                    </span>
                    <ColorBlock color={color} />
                </span>
            </div>
        )
    }
}
