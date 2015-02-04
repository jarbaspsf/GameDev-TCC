Meteor.subscribe('battleLogs', Session.get('battleLogsLimit'));
Meteor.subscribe('challenges');
Meteor.subscribe('PVPRooms');

//temporary
Meteor.subscribe('battleRegs');
