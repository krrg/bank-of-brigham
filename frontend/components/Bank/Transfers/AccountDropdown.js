import React from "react";
import Select from "react-select";


export default class renderAccountDropdown extends React.Component {

    constructor(props) {
        super();

        this.state = {

        }
    }


    handleSelectChanged = (stateKey, option, e) => {
        const newState = {};
        newState[stateKey] = option.id;
        this.setState(newState);
        this.props.handleSelectChanged(newState)
    }

    renderAccountDropdown = (stateKey) => {
        const options = this.state.accounts.map(a => {
            return _.merge({}, a, {
                "value": a["id"],
            })
        });

        return (
            <Select
                options={options}
                optionComponent={TransferOption}
                maxHeight={10}
                value={this.state[stateKey]}
                valueComponent={TransferOption}
                onChange={(option, e) => {this.handleSelectChanged(stateKey, option, e)}}
                clearable={false}
                arrowRenderer={this.state[stateKey] ? null : undefined}
                inputRenderer={this.state[stateKey] ? undefined : undefined}
                multi={false}
                searchable={false}
            />
        )
    }
}
