import AltInstance from "../alt";

const BankActions = AltInstance.generateActions(
    'getAccounts',
    'getAccountsCompleted',
    'getAccountsErrored',
);

export default BankActions;
