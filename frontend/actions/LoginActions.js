import AltInstance from "../alt";

const LoginActions = AltInstance.generateActions(

    'logout',
    'logoutCompleted',

    'loginPassword',
    'loginPasswordCompleted',
    'loginPasswordErrored',

    /* Send the verification code */
    'beginSms',
    'beginSmsCompleted',
    'beginSmsErrored',

    /* Try to login using a user-entered verification code */
    'loginSms',
    'loginSmsCompleted',
    'loginSmsErrored',

    'loginBackupCode',
    'loginBackupCodeCompleted',
    'loginBackupCodeErrored',

    'loginTotp',
    'loginTotpCompleted',
    'loginTotpErrored',

    'loginU2F',
    'loginU2FCompleted',
    'loginU2FErrored',

);

export default LoginActions;
