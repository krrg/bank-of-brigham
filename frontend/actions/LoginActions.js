import AltInstance from "../alt";

const LoginActions = AltInstance.generateActions(
    'loginPassword',
    'loginPasswordCompleted',
    'loginPasswordErrored',

    'loginSms',
    'loginSmsCompleted',
    'loginSmsErrored',

);

export default LoginActions;
