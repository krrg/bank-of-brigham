import React from "react";
import PropTypes from "prop-types";
import Select from "react-select";

import "./Transfers.scss";
import { TAccountList } from "../../../constants";

export default class Transfers extends React.Component {

    static propTypes = {
        accounts: TAccountList.isRequired
    }

    renderAccountDropdown = () => {
        const options = this.props.accounts

        return (
            <Select

            />
        )
    }

    render() {
        return (
            <div className="Transfers">
                <div className="section-box">
                    <div className="__header">
                        <h2>Transfers</h2>
                    </div>

                    <div className="__content">
                        <form>
                            <p>Transfer from:</p>
                            { this.renderAccountDropdown() }
                            <br />
                            <p>Transfer to:</p>
                            { this.renderAccountDropdown() }
                        </form>

                    </div>
                </div>
            </div>
        )
    }

}