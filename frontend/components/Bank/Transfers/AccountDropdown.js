import React from "react";
import PropTypes from "prop-types";
import Select from "react-select";
import TransferOption from "./TransferOption";


export default class AccountDropdown extends React.Component {

    static propTypes = {
        handleSelectChanged: PropTypes.func.isRequired,
        accounts: PropTypes.arrayOf(PropTypes.any),
    }

    constructor() {
        super();

        this.state = {
            "account": null
        }
    }


    handleSelectChanged = (stateKey, option, e) => {
        this.setState({
            account: option.id
        });
        this.props.handleSelectChanged({
            account: option.id
        })
    }

    renderAccountDropdown = (stateKey) => {
        const options = this.props.accounts.map(a => {
            return _.merge({}, a, {
                "value": a["id"],
            })
        });

        return (
            <Select
                options={options}
                optionComponent={TransferOption}
                maxHeight={10}
                value={this.state.account}
                valueComponent={TransferOption}
                onChange={(option, e) => {this.handleSelectChanged(stateKey, option, e)}}
                clearable={false}
                arrowRenderer={this.state.account ? null : undefined}
                inputRenderer={this.state.account ? undefined : undefined}
                multi={false}
                searchable={false}
            />
        )
    }

    render() {
        return this.renderAccountDropdown(this.props.stateKey);
    }
}
