import AltInstance from "../alt";

const AdminActions = AltInstance.generateActions(
    'getPasswordLoginEvents',
    'getPasswordLoginEventsCompleted',
    'getPasswordLoginEventsErrored',

    'get2faLoginEvents',
    'get2faLoginEventsCompleted',
    'get2faLoginEventsErrored',

);

export default AdminActions;
