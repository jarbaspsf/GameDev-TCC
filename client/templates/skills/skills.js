Template.skills.helpers({
  skills: function(){
    return Meteor.user().profile.skills;
  },

  allSkills: function(){
    return Skills.find();
  }
});

Template.skills.rendered = function(){

}

Template.skills.events({
  "click .skillToEquip": function(event){
    event.preventDefault();
    Session.set("skillToEquip", this._id);
  },

  "click #equipSkill": function(event){
    event.preventDefault();
    if(!Session.get("skillToEquip")){
      alert("Please select a skill to equip");
      return;
    }

    if(Meteor.user().profile.skills.length > 3){
      alert("Please remove a active skill first!");
      return;
    }


    Meteor.call('equipSkill', Session.get("skillToEquip"));
  },

});
