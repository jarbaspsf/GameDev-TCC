Meteor.subscribe('battleLogs', Session.get('battleLogsLimit'));
Meteor.subscribe('challenges');
Meteor.subscribe('PVPRooms');
Meteor.subscribe('skills');

//temporary
Meteor.subscribe('battleRegs');
