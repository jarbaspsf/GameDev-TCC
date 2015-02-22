Meteor.methods({
  useItem: useItem
})

function useItem(itemId){
  var item = Items.findOne(itemId);
  var existsOnInventory = false;
  var existsOnSkillsInventory = false;
  var inventorySkills;
  var sucessMessage = {};
  if(!item)
    throw new Meteor.Error(500, "Item not found!");

  //tests Lvl and class
  if(item.reqLvl > Meteor.user().profile.lvl)
    throw new Meteor.Error(500, "Don't hane enough level");

  if(item.class && item.class != Meteor.user().profile.charClass)
    throw new Meteor.Error(500, "Item not for your class");

  var inventory = Meteor.user().profile.inventory;
  var index, indexSkill;
  for(var i = 0; i < inventory.length; i++){
    if(inventory[i]._id == itemId){
      index = i;
      existsOnInventory = true;
    }
  };

  if(!existsOnInventory)
    new Meteor.Error(500, "Item does not exists on inventory");

  var querySet = {};
  var queryInc = {};
  //if skill stone
  if(item.skillItem){
    inventorySkills = Meteor.user().profile.inventorySkills;
    var skill = Skills.findOne(item.skillItem);
    if(!skill)
      throw new Meteor.Error(500, "Skill does not exists");
    if(inventorySkills.length > 15)
      throw new Meteor.Error(500, "Inventory Full");

    inventorySkills.push(skill);
    querySet["profile.inventorySkills"] = inventorySkills;
    sucessMessage.tittle = "Skill Learned!";
    sucessMessage.message = "The Skill was put into your Skills Inventory";
  };
  //if buff item

  //if increase item
  if(item.action && item.action.increase){
    queryInc["profile."+item.action.increase.stats] = item.action.increase.qty;
  };

  inventory.splice(index, 1);
  querySet["profile.inventory"] = inventory;
  Meteor.users.update(Meteor.userId(), {
    $set: querySet,
    $inc: queryInc
  })


  CHAR_HELPERS.checkMaxAttrs();
  return sucessMessage;
}
