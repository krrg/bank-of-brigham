import PropTypes from "prop-types";

export default PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.any.isRequired,
    displayName: PropTypes.string.isRequired,
    type: PropTypes.oneOf(["checking", "savings", "certificate", "moneymarket"]),
    balance: PropTypes.number.isRequired
}));
