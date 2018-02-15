import React from "react";
import PropTypes from "prop-types";

import "./ErrorWrapper.scss";

export default class ErrorWrapper extends React.Component {

    static propTypes = {
        isErrored: PropTypes.bool,
        message: PropTypes.string,
    }

    renderErrorMessage = () => {
        if (! this.props.isErrored) {
            return null;
        }
        return (
            <div className="__message">
                { this.props.message }
            </div>
        )
    }

    render() {
        const className = this.props.isErrored ? "ErrorWrapper __errored" : "ErrorWrapper";

        return (
            <div className={className}>
                { this.props.children }
                { this.renderErrorMessage() }
            </div>
        )
    }

}
