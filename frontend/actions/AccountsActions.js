import AltInstance from "../alt";

const AccountsActions = [
    'get',
    'getCompleted'
]

export default AltInstance.generateActions(AccountsActions);
