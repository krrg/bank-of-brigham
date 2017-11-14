import AltInstance from "../alt";

const SignupActions = AltInstance.generateActions(
    'postSignup',
    'postSignupCompleted',
    'postSignupErrored',

    'postSignupSms',
    'postSignupSmsCompleted',
    'postSignupSmsErrored',

);

export default SignupActions;
