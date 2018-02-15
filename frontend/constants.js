import PropTypes from "prop-types";
import _ from "lodash";

export const accountTypes = [
    {
        key: "checking",
        displayName: "Checking",
        color: "#FAA916"
    }, {
        key: "savings",
        displayName: "Savings",
        color: "#275D93",
    }, {
        key: "certificate",
        displayName: "Certificate (CD)",
        color: "#468189"
    }, {
        key: "moneymarket",
        displayName: "Money Market",
        color: "#85B022"
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

export const apihost = "/api";
