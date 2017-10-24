import AltInstance from "../alt";

const AccountsActions = AltInstance.generateActions(
    'get',
    'getCompleted',
    'getErrored',
);

export default AccountsActions;
