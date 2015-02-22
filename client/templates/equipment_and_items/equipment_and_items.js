Template.equipmentandItems.helpers({
  activeEquipment: function(){
    activeEquipment = Meteor.user().profile.activeEquipment;
    var equips = [];
    for(var index in activeEquipment) {
      if (activeEquipment.hasOwnProperty(index)) {
        equips.push(activeEquipment[index]);
      }
    };

    return equips;
  },

  inventory: function(){
    return Meteor.user().profile.inventory;
  },

  inventoryLength: function(){
    return Meteor.user().profile.inventory.length;
  }
});

Template.equipmentandItems.rendered = function(){
  Session.set("equipToRemove", null);
  Session.set("equipToAdd", null);
}

Template.equipmentandItems.events({
  'click .equipToRemove': function(event){
    event.preventDefault();
    Session.set("equipToRemove", this._id);
    $("#itemBtn").text("Unequip");
  },

  'click .useItem': function(event){
    event.preventDefault();
    Session.set("itemId", this._id);
    if(this.equipment){
      $("#itemBtn").text("Equip");
    }else{
      $("#itemBtn").text("Use");
    }

    $("#destroyBtn").attr("disabled", false);
  },

  "click #destroyBtn": function(event){
    event.preventDefault();
    Meteor.call('destroyItems', Session.get("itemId"));
    Session.set("itemId", null);
    $("#destroyBtn").attr("disabled", true);
  },

  'click #itemBtn': function(event){
    event.preventDefault();
    if($(event.target).text() == 'Equip'){
      Meteor.call("addEquipment", Session.get("itemId"), function(err, result){
        resetButtons();
      });
    }else if($(event.target).text() == 'Use'){
      Meteor.call("useItem", Session.get("itemId"), function(err, result){
        if(err){
          var data = {
            message: err.reason,
            tittle: "Use Item Error"
          }
          Modal.show('simpleModal', data);
        }else{
          if(result.tittle){
            var data = {
              message: result.message,
              tittle: result.tittle
            }
            Modal.show('simpleModal', data);
          }
        }
        resetButtons();
      });
    }else{
      Meteor.call("removeEquipment", Session.get("equipToRemove"), function(err, result){
        resetButtons();
      });
    }
  },
})

function resetButtons(){
  $("#itemBtn").text("Use");
  Session.set("equipToRemove", null);
  Session.set("equipToAdd", null);
  $("#destroyBtn").attr("disabled", true);
}
