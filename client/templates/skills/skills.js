Template.skills.helpers({
  skills: function(){
    return Meteor.user().profile.skills;
  },

  allSkills: function(){
    return Meteor.user().profile.inventorySkills;
  },

  inventorySkillsLength: function(){
    return Meteor.user().profile.inventorySkills.length;
  },

  skillsLength: function(){
    return Meteor.user().profile.skills.length;
  }
});

Template.skills.rendered = function(){
  Session.set("skillToEquip", null);
  Session.set("skillToUnset", null);
}

Template.skills.events({
  "click .skillToEquip": function(event){
    event.preventDefault();
    Session.set("skillToEquip", this._id);
    $("#btnSkill").text("Set");
    $("#btnForget").attr("disabled", false);
  },

  "click .skillToUnset": function(event){
    event.preventDefault();
    Session.set("skillToUnset", this._id);
    $("#btnSkill").text("Unset");
  },

  "click #btnForget": function(event){
    event.preventDefault();
    Meteor.call('destroySkills', Session.get("skillToEquip"));
    Session.set("skillToEquip", null);
    $("#btnForget").attr("disabled", true);
  },

  "click #btnSkill": function(event){
    event.preventDefault();
    if($(event.target).text() == "Unset"){
      if(!Session.get("skillToUnset")){
        alert("Please select a skill to unset");
        return;
      }
      Meteor.call('unsetSkill', Session.get("skillToUnset"), function(err, result){
        resetButtons();
      });
    }else{
      if(!Session.get("skillToEquip")){
        alert("Please select a skill to equip");
        return;
      }

      if(Meteor.user().profile.skills.length > 3){
        alert("Please remove a active skill first!");
        return;
      }
      Meteor.call('equipSkill', Session.get("skillToEquip"), function(err, result){
        resetButtons();
      });
    }
  },


});

function resetButtons(){
  $("#btnSkill").text("Set");
  Session.set("skillToEquip", null);
  Session.set("skillToUnset", null);
  $("#btnForget").attr("disabled", true);
}
