import AltInstance from "../alt";

const LoginActions = AltInstance.generateActions(
    'loginPassword',
    'loginPasswordCompleted',
    'loginPasswordErrored',
);

export default LoginActions;
