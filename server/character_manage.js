Meteor.methods({
  createChar: createChar,
  updateStats: updateStats,
  initTraining: initTraining,
  updateSkillPoints: updateSkillPoints,
  equipSkill: equipSkill,
  calculateBonus: calculateBonus
});

function createChar(charClass, charName){

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
        inventoruSkills: [],
        activeEquipment: {
          head: stats.head,
          armor: stats.armor,
          mainHand: stats.MH,
          offHand: stats.OH,
          legs: stats.legs,
          boot: stats.boot
        }
      }
    }
  });

  CHAR_HELPERS.calculateBonus(true);
  return true;
}

function updateStats(type){

  var query, skp;
  if(type == "maxHP"){
    query = {$inc : {"profile.maxHP": 10, "profile.skp": -1}};
  }else if(type == "str"){
    query = {$inc : {"profile.str": 1, "profile.skp": -1}};
  }else if(type == "def"){
    query = {$inc : {"profile.def": 1, "profile.skp": -1}};
  }else if(type == "spd"){
    query = {$inc : {"profile.spd": 1, "profile.skp": -1}};
  }else if(type == 'mana'){
    query = {$inc : {"profile.mana": 5, "profile.skp": -1}};
  }

  skp = Meteor.user().profile.skp;

  if(!query || !skp){
    return false;
  }

  updateStat = function(query, callback){
    Meteor.users.update(Meteor.userId(), query, function(err){
      if(err){
        callback(true);
      }else{
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
      if (activeEquipment.hasOwnProperty(index)) {
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
      "profile.str": str + bStr,
      "profile.def": def + bDef,
      "profile.int": int + bInt,
      "profile.con": con + bCon,
      "profile.spd": spd + bSpd,
      "profile.maxHP": hp + bHP,
      "profile.maxMana": mana + bMana
    };

    if(firstCreate){
      query["profile.currentHP"] = query["profile.maxHP"];
    }

    Meteor.users.update(user._id, {
      $set : query
    });
  }
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
    boot: null
  };


  if(charClass == 'Knight'){
    initialStats.maxHP = 150;
    initialStats.str = 9;
    initialStats.def = 10;
    initialStats.spd = 3;
    initialStats.mana = 50;
    initialStats.initialSkill = Skills.findOne({name: "Power Strike"});
    initialStats.MH = Items.findOne({name: "Iron Sword"});
    initialStats.OH = Items.findOne({name: "Iron Shield"});
    initialStats.head = Items.findOne({name: "Iron Helmet"});
    initialStats.armor = Items.findOne({name: "Iron Armor"});
    initialStats.legs = Items.findOne({name: "Iron Leggins"});
    initialStats.boot = Items.findOne({name: "Iron Boot"});
  }else if(charClass == 'Mage'){
    initialStats.maxHP = 110;
    initialStats.str = 5;
    initialStats.def = 2;
    initialStats.spd = 5;
    initialStats.mana = 100;
    initialStats.initialSkill = Skills.findOne({name: "Fireball"});
  }else if(charClass == 'Rogue'){
    initialStats.maxHP = 125;
    initialStats.str = 7;
    initialStats.def = 6;
    initialStats.spd = 9;
    initialStats.mana = 75;
    initialStats.initialSkill = Skills.findOne({name: "Backstab"});
  }

  return initialStats;
}

function equipSkill(skillId){
  skill = Skills.findOne(skillId);

  if(skill){
    var alreadyEquiped = false;
    var userSkills = Meteor.user().profile.skills;
    if(userSkills.length > 3){
      return {err: "All slots are equiped"};
    }

    userSkills.forEach(function(skill){
      if(skill._id == skillId){
        alreadyEquiped = true;
      }
    });

    if(alreadyEquiped){
      return {err: "Skill already equiped"};
    }else{
      userSkills.push(skill);
      Meteor.users.update(Meteor.userId(), {
        $set: {
          "profile.skills": userSkills
        }
      });

      return true;
    }

  }else{
    return {err: "skill not found"};
  }
}
