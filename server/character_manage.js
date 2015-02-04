Meteor.methods({
  createChar: createChar,
  updateStats: updateStats,
  initTraining: initTraining,
  updateSkillPoints: updateSkillPoints
});

function createChar(charClass, charName){

  stats = getInitialStatus(charClass);

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
        def: stats.def,
        spd: stats.spd,
        sta: 100,
        firstLogin: false,
        lvl: 1,
        inTraining: false,
        initTimeTraining: 0,
        trainingTime: 0,
        skp: 0
      }
    }
  });

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
  updateSkp = function(callback){
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
    }, function(err){
      if(err){
        callback(true);
      }else{
        callback(false);
      }
    });
  }

  //test if was training
  var user = Meteor.user();
  var totalTrainingTime = user.profile.initTimeTraining + (user.profile.trainingTime * 1000);
  var a = new Date().getTime();
  if(!(totalTrainingTime >= new Date().getTime())){
    return "Is Still Training!";
  }else{
    var updateSkilPoints = Meteor.wrapAsync(updateSkp);
    return updateSkilPoints();
  }
}

//Helpers

function getInitialStatus(charClass){

  var initialStats = {
    maxHP: 0,
    str: 0,
    def: 0,
    spd: 0,
    mana: 0
  };

  if(charClass == 'Knight'){
    initialStats.maxHP = 150;
    initialStats.str = 10;
    initialStats.def = 10;
    initialStats.spd = 2;
    initialStats.mana = 50;
  }else if(charClass == 'Mage'){
    initialStats.maxHP = 100;
    initialStats.str = 5;
    initialStats.def = 5;
    initialStats.spd = 5;
    initialStats.mana = 100;
  }else if(charClass == 'Druid'){
    initialStats.maxHP = 125;
    initialStats.str = 7;
    initialStats.def = 7;
    initialStats.spd = 3;
    initialStats.mana = 75;
  }

  return initialStats;
}
