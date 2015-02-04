Meteor.publish('battleLogs', function(limit) {
  //default limit if none set
  var dl = limit || 1;
  return BattleLogs.find({});
});

Meteor.publish('challenges', function(limit) {
  return Challenges.find();
});

Meteor.publish('battleRegs', function(limit) {
  return BattleRegs.find();
});

Meteor.publish('PVPRooms', function(limit) {
  return PVPRooms.find({}, {userId: {$ne: this.userId}});
});
