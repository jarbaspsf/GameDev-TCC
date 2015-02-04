Meteor.methods({
  initBattleLog: initBattleLog,
  updateBattleLog: updateBattleLog
})


function initBattleLog(enemyId){

  enemy = Challenges.findOne(enemyId);

  if(!enemy){
    return new Error();
  }

  battleReg = {
    userId: Meteor.userId(),
    username: Meteor.user().username,
    enemyId: enemyId,
    enemyName: enemy.name
  }

  battleRegId = BattleRegs.insert(battleReg)

  battleLog = {
    userId: Meteor.userId(),
    username: Meteor.user().username,
    charName: Meteor.user().profile.charName,
    charMaxHP: Meteor.user().profile.maxHP,
    charCurrentHP: Meteor.user().profile.maxHP,
    enemyId: enemyId,
    enemyName: enemy.name,
    enemyMaxHP: enemy.maxHP,
    enemyCurrentHP: enemy.maxHP,
    log: Meteor.user().profile.charName + " engages " + enemy.name,
    date: new Date().getTime(),
    result : {
      state: 'initied', won_by: null
    },
    battleRegId: battleRegId
  }

  Meteor.users.update(Meteor.userId(), {
    $inc: {
      "profile.sta": -5
    }
  });

  resetCharCurrentHP();
  BattleLogs.insert(battleLog);
  return battleRegId;


}

function updateBattleLog(actionUser, type, skillId, enemyId, pvp, battleRegId){

  var damage, usesSkill, enemy;
  var skill = Skills.findOne(skillId);
  enemy = Challenges.findOne(enemyId);

  //normal atk
  if(skill){
    damage = ((Meteor.user().profile.str * skillBonus) * Math.floor((Math.random() * 2) + 1)).toFixed();
    usesSkill = true;
  }else if(actionUser != 'enemy'){
    damage = ((Meteor.user().profile.str) * Math.floor((Math.random() * 2) + 1)).toFixed();
  }else{
    damage = ((enemy.str) * Math.floor((Math.random() * 2) + 1)).toFixed()
  }

  var log;

  if(usesSkill && skill.prop == 'heal'){
    log = actionUser + " uses "+ skill.name +" and heals for: "+ damage + " HP";
  }else if(usesSkill && skill.prop == 'dmg'){
    log = actionUser + " uses "+ skill.name +" and hits for: "+ damage + " HP";
  }else{
    log = actionUser + " attack and hits for: "+ damage + " HP";
  }

  var lastBattleLog = BattleLogs.find({battleRegId: battleRegId}, {sort : {date: -1}}).fetch()[0];

  if(lastBattleLog.result.state == 'finished'){
    return lastBattleLog;
  }

  var battleLog = {
    userId: Meteor.userId(),
    username: Meteor.user().username,
    charName: Meteor.user().profile.charName,
    charMaxHP: Meteor.user().profile.maxHP,
    charCurrentHP: Meteor.user().profile.currentHP,
    enemyId: enemyId,
    enemyName: enemy.name,
    enemyMaxHP: enemy.maxHP,
    enemyCurrentHP: lastBattleLog.enemyCurrentHP,
    log: log,
    date: new Date().getTime(),
    battleRegId: battleRegId
  }

  if(type == "enemy"){
    updateCharDmg(damage);
    if(Meteor.user().profile.currentHP <= 0){
      battleLog.result = {state: 'finished', won_by: actionUser};
      battleLog.log = actionUser + " won the battle!";
    }else{
      battleLog.charCurrentHP = Meteor.user().profile.currentHP;
      battleLog.result = {state: 'fighting', won_by: null};
    }
    BattleLogs.insert(battleLog);
    return battleLog;
  }else{
    if(pvp){

    }else{
      if(lastBattleLog.enemyCurrentHP - damage <= 0){
        battleLog.enemyCurrentHP = 0;
        battleLog.result = {state: 'finished', won_by: actionUser};
        battleLog.log = actionUser + " won the battle!";
      }else{
        battleLog.enemyCurrentHP = (lastBattleLog.enemyCurrentHP - damage).toFixed();
        battleLog.result = {state: 'fighting', won_by: null};
      }
      BattleLogs.insert(battleLog);
      return battleLog;
    }
  }
}

function updateCharDmg(damage){

  Meteor.users.update(Meteor.userId(), {
    $inc: {
      "profile.currentHP": -(damage)
    }
  });
}

function resetCharCurrentHP(){

  Meteor.users.update(Meteor.userId(), {
    $set: {
      "profile.currentHP": Meteor.user().profile.maxHP
    }
  });
}
