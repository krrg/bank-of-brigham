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

);

export default SignupActions;
