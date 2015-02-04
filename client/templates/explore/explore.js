Template.explore.helpers({
  challenges: function(){
    return Challenges.find();
  }
})

Template.explore.events({
  'click .btn-challenge': function(event){
    event.preventDefault();
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
