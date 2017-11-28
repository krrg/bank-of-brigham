import AltInstance from "../alt";

const SignupActions = AltInstance.generateActions(
    'postSignup',
    'postSignupCompleted',
    'postSignupErrored',

    'postSignupSms',
    'postSignupSmsCompleted',
    'postSignupSmsErrored',

    'postSignupBackupCodes',
    'postSignupBackupCodesCompleted',
    'postSignupBackupCodesErrored',

);

export default SignupActions;
