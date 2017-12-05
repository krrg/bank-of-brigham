import AltInstance from "../alt";

const SignupActions = AltInstance.generateActions(
    'signup',
    'signupCompleted',
    'signupErrored',

    'signupSms',
    'signupSmsCompleted',
    'signupSmsErrored',

    'signupBackupCodes',
    'signupBackupCodesCompleted',
    'signupBackupCodesErrored',

    'signupTotp',
    'signupTotpCompleted',
    'signupTotpErrored',

    'signupU2F',
    'signupU2FCompleted',
    'signupU2FErrored',

    'signupPush',
    'signupPushCompleted',
    'signupPushErrored',

);

export default SignupActions;
