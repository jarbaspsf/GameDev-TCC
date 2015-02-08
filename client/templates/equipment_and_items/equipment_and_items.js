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
  }
})
