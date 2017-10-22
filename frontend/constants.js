import PropTypes from "prop-types";
import _ from "lodash";

export const accountTypes = [
    {
        key: "checking",
        displayName: "Checking",
        color: "#F1C40F"
    }, {
        key: "savings",
        displayName: "Savings",
        color: "#A04000",
    }, {
        key: "certificate",
        displayName: "Certificate (CD)",
        color: "#D68910"
    }, {
        key: "moneymarket",
        displayName: "Money Market",
        color: "#6E2C00"
    }
]

export const accountTypeKeys = accountTypes.map(type => type["key"]);

export const accountTypesMap = _.keyBy(accountTypes, a => a["key"]);

export const TAccountList = PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.any.isRequired,
    displayName: PropTypes.string.isRequired,
    type: PropTypes.oneOf(accountTypeKeys),
    balance: PropTypes.number.isRequired
}));
