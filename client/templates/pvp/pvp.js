Template.playerVsPlayer.helpers({
  pvpRooms: function(){
    return PVPRooms.find();
  }
});


Template.playerVsPlayer.events({
  'click .btn-apply': function(event){
    event.preventDefault();
    Meteor.call("applyForPvP");
    $(event.target).attr('disabled', true);
  }
})
