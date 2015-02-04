Meteor.methods({
  applyForPvP: applyForPvP
})

function applyForPvP(){
  user = Meteor.user();
  pvpRoom = {
    userId: user._id,
    charName: user.profile.charName,
    charClass:user.profile.charClass,
    lvl:user.profile.lvl
  }

  PVPRooms.insert(pvpRoom);
  return true;
}
