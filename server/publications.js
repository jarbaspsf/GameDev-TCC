Meteor.publish('challenges', function(limit) {
  return Challenges.find();
});

Meteor.publish('battleRegs', function(limit) {
  return BattleRegs.find();
});

Meteor.publish('PVPRooms', function(limit) {
  return PVPRooms.find({}, {userId: {$ne: this.userId}});
});

Meteor.publish('skills', function(limit) {
  return Skills.find();
});
