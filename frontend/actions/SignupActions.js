import AltInstance from "../alt";

const SignupActions = AltInstance.generateActions(
    'postSignup',
    'postSignupCompleted',
    'postSignupErrored',

    'post2faBegin',
    'post2faBeginCompleted',
    'post2faBeginErrored',

    'post2faConfirm',
    'post2faConfirmCompleted',
    'post2faConfirmErrored',
);

export default SignupActions;
