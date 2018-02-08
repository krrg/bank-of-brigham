import AltInstance from "../alt";

const AdminActions = AltInstance.generateActions(
    'getPasswordLoginEvents',
    'getPasswordLoginEventsCompleted',
    'getPasswordLoginEventsErrored',

    'get2faLoginEvents',
    'get2faLoginEventsCompleted',
    'get2faLoginEventsErrored',

    'getUsersList',
    'getUsersListCompleted',
    'getUsersListErrored'

);

export default AdminActions;
