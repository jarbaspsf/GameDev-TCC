Template.explore.helpers({
  challenges: function(){
    return Challenges.find({boss: false});
  }
})

Template.explore.events({
  'click .btn-challenge': function(event){
    event.preventDefault();

    if(Meteor.user().profile.sta < 5 || Meteor.user().profile.currentHP <= 0)
      return;

    Session.set("enemyId", this._id);
    Meteor.call("initBattleLog", this._id, function(err, result){
      if(err){
        console.log(err);
      }else{
        console.log(result);
        Session.set("battleRegId", result);
        Session.set('currentTemplate', "exploreChallenge");
      }
    })

  }
})
