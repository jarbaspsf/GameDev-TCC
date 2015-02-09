Meteor.methods({
  createChar: createChar,
  updateStats: updateStats,
  initTraining: initTraining,
  updateSkillPoints: updateSkillPoints,
  equipSkill: equipSkill,
  calculateBonus: calculateBonus,
  removeEquipment: removeEquipment,
  addEquipment: addEquipment,
  unsetSkill: unsetSkill,
  destroyItems: destroyItems,
  destroySkills: destroySkills
});

function createChar(charClass, charName){
  if(checkSameCharName(charName)){
    throw new Meteor.Error( 500, 'The following character name already exists: '+charName);
  }

  stats = getInitialStatus(charClass);

  var initialSkills = [];
  initialSkills.push(stats.initialSkill);

  Meteor.users.update(Meteor.userId(), {
    $set: {
      profile: {
        charClass: charClass,
        charImgPath: charClass.toLowerCase() + ".png",
        charName: charName,
        currentHP: stats.maxHP,
        currentMana: stats.mana,
        maxHP: stats.maxHP,
        maxMana: stats.mana,
        str: stats.str,
        int: stats.int,
        con: stats.con,
        def: stats.def,
        spd: stats.spd,
        sta: 100,
        firstLogin: false,
        lvl: 1,
        inTraining: false,
        initTimeTraining: 0,
        trainingTime: 0,
        skp: 1,
        skills: initialSkills,
        inventory: [],
        inventorySkills: [],
        activeEquipment: {
          head: stats.head,
          armor: stats.armor,
          MH: stats.MH,
          OH: stats.OH,
          legs: stats.legs,
          boots: stats.boots
        },
        buffs: {
          speedBuff: {
            active: false,
            tick: 0,
            qty: 0
          },

          strengthBuff: {
            active: false,
            tick: 0,
            qty: 0
          },

          inteligenceBuff: {
            active: false,
            tick: 0,
            qty: 0
          },
        },
        debuffs: {
          stunDebuff: {
            active: false,
            tick: 0
          },
          speedDebuff: {
            active: false,
            tick: 0,
            qty: 0
          },
          bleedingDebuff: {
            active: false,
            tick: 0,
            qty: 0
          }
        },
        battle: {
          progress: 0
        }
      }
    }
  });

  CHAR_HELPERS.calculateBonus(true);
  return true;
}

function updateStats(type){

  var query, skp, statsPoints;
  if(type == "maxHP"){
    statsPoints = 10;
  }else if(type == 'maxMana'){
    statsPoints = 5;
  }else{
    statsPoints = 1;
  }

  query = {};
  query["profile."+type] = statsPoints;
  query["profile.skp"] = -1;
  skp = Meteor.user().profile.skp;

  if(!query || !skp){
    return false;
  }

  updateStat = function(query, callback){
    Meteor.users.update(Meteor.userId(), {
      $inc : query
    }, function(err){
      if(err){
        callback(true);
      }else{
        CHAR_HELPERS.calculateBonus();
        callback(false);
      }
    });
  }


  var updateStatsWrp = Meteor.wrapAsync(updateStat);
  return updateStatsWrp(query);

}

function initTraining(){

  if(Meteor.user().profile.lvl >= 100)
    return false;

  var trainingTime = Meteor.user().profile.lvl * 20;
  var initDateTime = new Date().getTime();

  Meteor.users.update(Meteor.userId(), {
    $set: {
        "profile.inTraining": true,
        "profile.initTimeTraining": initDateTime,
        "profile.trainingTime": trainingTime
    }
  });

  data = {
    seconds: trainingTime,
    dateTime: initDateTime
  }

  return data;

}

function updateSkillPoints(){


  //test if was training
  var user = Meteor.user();
  var totalTrainingTime = user.profile.initTimeTraining + (user.profile.trainingTime * 1000);
  currentDate = new Date();
  currentDate.setSeconds(currentDate.getSeconds() + 30);

  if(totalTrainingTime > currentDate.getTime()){
    return "Is Still Training!";
  }else{
    Meteor.users.update(Meteor.userId(), {
      $inc: {
        "profile.skp": 1,
        "profile.lvl": 1
      },

      $set: {
        "profile.inTraining": false,
        "profile.initTimeTraining": 0,
        "profile.trainingTime": 0
      }
    });


    return true;
  }
}

function calculateBonus(){
  CHAR_HELPERS.calculateBonus();
}

function removeEquipment(equipId){
  var inventory = Meteor.user().profile.inventory;
  if(inventory.length > 15){
    return false;
  }else{
    item = Items.findOne(equipId);
    inventory.push(item);
    var query = {
      "profile.inventory": inventory
    };
    CHAR_HELPERS.resetCharEquipSlot(item.slot);
    Meteor.users.update(Meteor.userId(), {
      $set : query
    });

    CHAR_HELPERS.calculateBonus();
  }
}

function addEquipment(equipId){
  var inventory = Meteor.user().profile.inventory;

  item = Items.findOne(equipId);
  var newInventory = [];
  var index, existsOnInventory;
  for(var i = 0; i < inventory.length; i++){
    if(inventory[i]._id == equipId){
      index = i;
      existsOnInventory = true;
    }
  };


  inventory.splice(index, 1);

  var query = {
    "profile.inventory": inventory
  };
  CHAR_HELPERS.AddCharEquipSlot(item);
  Meteor.users.update(Meteor.userId(), {
    $set : query
  });

  CHAR_HELPERS.calculateBonus();

}

function unsetSkill(skillId){
  var inventorySkills = Meteor.user().profile.inventorySkills;
  var skills = Meteor.user().profile.skills;
  var index = -1;
  skill = Skills.findOne(skillId);
  inventorySkills.push(skill);

  for(var i = 0; i < skills.length; i++){
    if(skills[i]._id == skillId){
      index = i;
    }
  };

  if(index == -1){
    return;
  }

  skills.splice(index, 1);

  var query = {
    "profile.inventorySkills": inventorySkills,
    "profile.skills": skills
  };
  Meteor.users.update(Meteor.userId(), {
    $set : query
  });

}

function destroyItems(itemId){
  var inventory = Meteor.user().profile.inventory;
  var index = -1;
  console.log(itemId);
  inventory.forEach(function(item, i){
    if(item._id == itemId){
      index = i
    }
  });

  console.log(index);

  if(index == -1)
    return;

  inventory.splice(index, 1);

  Meteor.users.update(Meteor.userId(), {
    $set: {
      "profile.inventory": inventory
    }
  });
}

function destroySkills(skillId){
  var inventorySkills = Meteor.user().profile.inventorySkills;
  var index = -1;
  inventorySkills.forEach(function(skill, i){
    if(skill._id == skillId){
      index = i
    }
  });

  if(index == -1)
    return;

  inventorySkills.splice(index, 1);

  Meteor.users.update(Meteor.userId(), {
    $set: {
      "profile.inventorySkills": inventorySkills
    }
  });
}

CHAR_HELPERS = {
  calculateBonus: function(firstCreate){
    var bStr = 0;
    var bDef = 0;
    var bInt = 0;
    var bCon = 0;
    var bSpd = 0;
    var bMana = 0;
    var bHP = 0;

    var user = Meteor.user();
    var activeEquipment = user.profile.activeEquipment;
    //get current Status
    var str = user.profile.str;
    var def = user.profile.def;
    var int = user.profile.int;
    var con = user.profile.con;
    var spd = user.profile.spd;
    var mana = user.profile.maxMana;
    var hp = user.profile.maxHP;

    for(var index in activeEquipment) {
      if (activeEquipment.hasOwnProperty(index) && activeEquipment[index] && activeEquipment[index].bonus) {
        var attr = activeEquipment[index].bonus;
        if(attr.str){
          bStr += attr.str;
        }
        if(attr.def){
          bDef += attr.def;
        }
        if(attr.int){
          bInt += attr.int;
        }
        if(attr.con){
          bCon += attr.con;
        }
        if(attr.spd){
          bSpd += attr.spd;
        }
        if(attr.maxMana){
          bMana += attr.maxMana;
        }
        if(attr.maxHP){
          bHP += attr.maxHP;
        }
      }
    };

    var query = {
      "profile.totalStr": str + bStr,
      "profile.totalDef": def + bDef,
      "profile.totalInt": int + bInt,
      "profile.totalCon": con + bCon,
      "profile.totalSpd": spd + bSpd,
      "profile.totalMaxHP": hp + bHP,
      "profile.totalMaxMana": mana + bMana
    };

    if(firstCreate){
      query["profile.currentHP"] = query["profile.totalMaxHP"];
      query["profile.currentMana"] = query["profile.totalMaxMana"];
    }

    Meteor.users.update(user._id, {
      $set : query
    });

    if(Meteor.user().profile.currentHP > Meteor.user().profile.totalMaxHP){
      Meteor.users.update(Meteor.userId(), {
        $set: {
          "profile.currentHP": Meteor.user().profile.totalMaxHP
        }
      });
    }

    if(Meteor.user().profile.currentMana > Meteor.user().profile.totalMaxMana){
      Meteor.users.update(Meteor.userId(), {
        $set: {
          "profile.currentMana": Meteor.user().profile.totalMaxMana
        }
      });
    }
  },

  resetCharEquipSlot: function(slotName){
    var query = {};
    query["profile.activeEquipment."+slotName.toString()] = null;
    Meteor.users.update(Meteor.userId(), {
      $set: query
    });
  },

  AddCharEquipSlot: function(equip){
    var query = {};
    query["profile.activeEquipment."+equip.slot.toString()] = equip;
    Meteor.users.update(Meteor.userId(), {
      $set: query
    });
  }
}

function checkSameCharName(charName){
  return Meteor.users.findOne({"profile.charName" : {
    $regex : new RegExp(charName, "i") }
  });
}



function getInitialStatus(charClass){

  var initialStats = {
    maxHP: 0,
    str: 0,
    int: 10,
    con: 10,
    def: 0,
    spd: 0,
    mana: 0,
    initialSkill: null,
    head: null,
    armor: null,
    MH: null,
    OH: null,
    legs: null,
    boots: null
  };


  if(charClass == 'Knight'){
    initialStats.maxHP = 150;
    initialStats.str = 9;
    initialStats.def = 10;
    initialStats.spd = 7;
    initialStats.mana = 50;
    initialStats.initialSkill = Skills.findOne({name: "Power Strike"});
    initialStats.MH = Items.findOne({name: "Iron Sword"});
    initialStats.OH = Items.findOne({name: "Iron Shield"});
    initialStats.head = Items.findOne({name: "Iron Helmet"});
    initialStats.armor = Items.findOne({name: "Iron Armor"});
    initialStats.legs = Items.findOne({name: "Iron Leggins"});
    initialStats.boots = Items.findOne({name: "Iron Boots"});
  }else if(charClass == 'Mage'){
    initialStats.maxHP = 110;
    initialStats.str = 5;
    initialStats.def = 2;
    initialStats.spd = 9;
    initialStats.mana = 100;
    initialStats.initialSkill = Skills.findOne({name: "Fireball"});
    initialStats.MH = Items.findOne({name: "Basic Staff"});
    initialStats.OH = Items.findOne({name: "Basic Scepter"});
    initialStats.head = Items.findOne({name: "Adept Helmet"});
    initialStats.armor = Items.findOne({name: "Adept Coat"});
    initialStats.legs = Items.findOne({name: "Adept Leggins"});
    initialStats.boots = Items.findOne({name: "Adept Shoes"});
  }else if(charClass == 'Rogue'){
    initialStats.maxHP = 125;
    initialStats.str = 7;
    initialStats.def = 6;
    initialStats.spd = 13;
    initialStats.mana = 75;
    initialStats.initialSkill = Skills.findOne({name: "Backstab"});
    initialStats.MH = Items.findOne({name: "Basic Dagger"});
    initialStats.OH = Items.findOne({name: "Basic Pistol"});
    initialStats.head = Items.findOne({name: "Leather Mask"});
    initialStats.armor = Items.findOne({name: "Leather Jacket"});
    initialStats.legs = Items.findOne({name: "Leather Leggins"});
    initialStats.boots = Items.findOne({name: "Leather Boots"});
  }

  return initialStats;
}

function equipSkill(skillId){
  skill = Skills.findOne(skillId);

  if(skill){
    var alreadyEquiped = false;
    var existsOnInventory = false;
    var userSkills = Meteor.user().profile.skills;
    var inventorySkills = Meteor.user().profile.inventorySkills;
    if(userSkills.length > 3){
      return {err: "All slots are equiped"};
    }

    userSkills.forEach(function(skill){
      if(skill._id == skillId){
        alreadyEquiped = true;
      }
    });

    inventorySkills.forEach(function(skill, i){
      if(skill._id == skillId){
        existsOnInventory = true;
        index = i;
      }
    })


    if(alreadyEquiped){
      return {err: "Skill already equiped"};
    }else if(existsOnInventory){
      userSkills.push(skill);

      inventorySkills.splice(index, 1);


      Meteor.users.update(Meteor.userId(), {
        $set: {
          "profile.skills": userSkills,
          "profile.inventorySkills": inventorySkills
        }
      });

      return true;
    }else{
      return {err: "not exists on inventory"};
    }

  }else{
    return {err: "skill not found"};
  }
}
